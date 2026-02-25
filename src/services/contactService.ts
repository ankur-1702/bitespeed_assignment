import { Contact, IdentifyRequest, IdentifyResponse } from '../types/contact';

// Simulated in-memory database
let contacts: Contact[] = [];
let nextId = 1;

export const getContacts = (): Contact[] => {
  return [...contacts].sort((a, b) => a.id - b.id);
};

export const resetDatabase = (): void => {
  contacts = [];
  nextId = 1;
};

export const seedDatabase = (): void => {
  contacts = [
    {
      id: 1,
      phoneNumber: "123456",
      email: "lorraine@hillvalley.edu",
      linkedId: null,
      linkPrecedence: "primary",
      createdAt: new Date("2023-04-01T00:00:00.374Z"),
      updatedAt: new Date("2023-04-01T00:00:00.374Z"),
      deletedAt: null,
    },
    {
      id: 23,
      phoneNumber: "123456",
      email: "mcfly@hillvalley.edu",
      linkedId: 1,
      linkPrecedence: "secondary",
      createdAt: new Date("2023-04-20T05:30:00.11Z"),
      updatedAt: new Date("2023-04-20T05:30:00.11Z"),
      deletedAt: null,
    },
  ];
  nextId = 24;
};

const findContactsByEmail = (email: string): Contact[] => {
  return contacts.filter(c => c.email === email && c.deletedAt === null);
};

const findContactsByPhone = (phone: string): Contact[] => {
  return contacts.filter(c => c.phoneNumber === phone && c.deletedAt === null);
};

const findContactById = (id: number): Contact | undefined => {
  return contacts.find(c => c.id === id && c.deletedAt === null);
};

const getPrimaryContact = (contact: Contact): Contact => {
  if (contact.linkPrecedence === 'primary') {
    return contact;
  }
  const primary = findContactById(contact.linkedId!);
  return primary || contact;
};

const getAllLinkedContacts = (primaryId: number): Contact[] => {
  const result: Contact[] = [];
  const primary = findContactById(primaryId);
  if (primary) {
    result.push(primary);
  }
  
  // Find all secondary contacts linked to this primary
  const secondaries = contacts.filter(
    c => c.linkedId === primaryId && c.deletedAt === null
  );
  result.push(...secondaries);
  
  // Also find contacts that might be linked to secondaries (in case of chain)
  const secondaryIds = secondaries.map(s => s.id);
  const tertiaries = contacts.filter(
    c => c.linkedId && secondaryIds.includes(c.linkedId) && c.deletedAt === null
  );
  result.push(...tertiaries);
  
  return result;
};

const createContact = (
  email: string | null,
  phone: string | null,
  linkedId: number | null,
  linkPrecedence: 'primary' | 'secondary'
): Contact => {
  const now = new Date();
  const newContact: Contact = {
    id: nextId++,
    phoneNumber: phone,
    email: email,
    linkedId,
    linkPrecedence,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  contacts.push(newContact);
  return newContact;
};

const updateContactToSecondary = (contact: Contact, newPrimaryId: number): void => {
  const index = contacts.findIndex(c => c.id === contact.id);
  if (index !== -1) {
    contacts[index] = {
      ...contacts[index],
      linkedId: newPrimaryId,
      linkPrecedence: 'secondary',
      updatedAt: new Date(),
    };
    
    // Also update all contacts that were linked to this contact
    contacts.forEach((c, i) => {
      if (c.linkedId === contact.id) {
        contacts[i] = {
          ...c,
          linkedId: newPrimaryId,
          updatedAt: new Date(),
        };
      }
    });
  }
};

export const identify = (request: IdentifyRequest): IdentifyResponse => {
  const { email, phoneNumber } = request;
  
  // Normalize inputs
  const normalizedEmail = email?.trim() || null;
  const normalizedPhone = phoneNumber?.toString().trim() || null;
  
  if (!normalizedEmail && !normalizedPhone) {
    throw new Error("At least one of email or phoneNumber must be provided");
  }
  
  // Find existing contacts
  const contactsByEmail = normalizedEmail ? findContactsByEmail(normalizedEmail) : [];
  const contactsByPhone = normalizedPhone ? findContactsByPhone(normalizedPhone) : [];
  
  // Get unique contacts
  const allMatchingContacts = [...contactsByEmail, ...contactsByPhone];
  const uniqueContacts = allMatchingContacts.filter(
    (contact, index, self) => self.findIndex(c => c.id === contact.id) === index
  );
  
  // If no existing contacts found, create a new primary contact
  if (uniqueContacts.length === 0) {
    const newPrimary = createContact(normalizedEmail, normalizedPhone, null, 'primary');
    return {
      contact: {
        primaryContatctId: newPrimary.id,
        emails: normalizedEmail ? [normalizedEmail] : [],
        phoneNumbers: normalizedPhone ? [normalizedPhone] : [],
        secondaryContactIds: [],
      },
    };
  }
  
  // Find all primary contacts involved
  const primaryContacts = uniqueContacts
    .map(c => getPrimaryContact(c))
    .filter((contact, index, self) => self.findIndex(c => c.id === contact.id) === index)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
  // If there are multiple primary contacts, link the newer ones to the oldest
  if (primaryContacts.length > 1) {
    const oldestPrimary = primaryContacts[0];
    for (let i = 1; i < primaryContacts.length; i++) {
      updateContactToSecondary(primaryContacts[i], oldestPrimary.id);
    }
  }
  
  // Get the primary contact (oldest one)
  const primaryContact = primaryContacts[0];
  
  // Check if we need to create a new secondary contact
  const allLinked = getAllLinkedContacts(primaryContact.id);
  
  const emailExists = !normalizedEmail || allLinked.some(c => c.email === normalizedEmail);
  const phoneExists = !normalizedPhone || allLinked.some(c => c.phoneNumber === normalizedPhone);
  
  // Check if we have an exact match (both email and phone already exist in the same contact)
  const exactMatch = allLinked.some(
    c => c.email === normalizedEmail && c.phoneNumber === normalizedPhone
  );
  
  // Create secondary contact if new information is provided
  if (!exactMatch && normalizedEmail && normalizedPhone && (!emailExists || !phoneExists)) {
    createContact(normalizedEmail, normalizedPhone, primaryContact.id, 'secondary');
  }
  
  // Get all linked contacts again (in case we just created one)
  const finalLinked = getAllLinkedContacts(primaryContact.id);
  
  // Build response
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryIds: number[] = [];
  
  // Add primary contact info first
  if (primaryContact.email) emails.add(primaryContact.email);
  if (primaryContact.phoneNumber) phoneNumbers.add(primaryContact.phoneNumber);
  
  // Add secondary contacts info
  finalLinked
    .filter(c => c.id !== primaryContact.id)
    .forEach(c => {
      if (c.email) emails.add(c.email);
      if (c.phoneNumber) phoneNumbers.add(c.phoneNumber);
      secondaryIds.push(c.id);
    });
  
  return {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      secondaryContactIds: secondaryIds.sort((a, b) => a - b),
    },
  };
};
