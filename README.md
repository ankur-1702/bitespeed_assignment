# Bitespeed Identity Reconciliation [Service](https://identityreconcilation-013de4.netlify.app/)

A customer identity linking service built for FluxKart.com to track and consolidate customer contact information across multiple purchases.

## The Problem

E-commerce platforms often face a common challenge: customers use different email addresses and phone numbers across purchases. This makes it difficult to:

- Identify returning customers
- Provide personalized experiences
- Track customer purchase history
- Reward loyal customers appropriately

## The Solution

This service maintains a `Contact` database that intelligently links customer information. When a customer makes a purchase, the service:

1. Checks if the email or phone number matches any existing contact
2. Links related contacts together (primary/secondary relationship)
3. Returns a consolidated view of all linked contact information

## How It Works

### Contact Linking Logic

- **New Customer**: If no matching email or phone exists, a new primary contact is created
- **Existing Customer, New Info**: If either email OR phone matches but new information is provided, a secondary contact is created and linked
- **Merging Contacts**: If a request links two previously separate primary contacts, the newer one becomes secondary

### Data Model

```typescript
Contact {
  id: number
  phoneNumber: string | null
  email: string | null
  linkedId: number | null      // Points to primary contact
  linkPrecedence: "primary" | "secondary"
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

## API Reference

### POST /identify

Identifies and consolidates contact information.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "phoneNumber": "1234567890"
}
```

Both fields are optional, but at least one must be provided.

**Response:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["primary@example.com", "secondary@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

- `emails` array has the primary contact's email first
- `phoneNumbers` array has the primary contact's phone first
- `secondaryContactIds` contains all linked secondary contact IDs

## Example Scenarios

### Scenario 1: Brand New Customer

**Request:**
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "555-1985"
}
```

**Result:** Creates a new primary contact. Returns that contact with empty secondaryContactIds.

### Scenario 2: Same Customer, Different Email

**Database has:**
- Contact 1: doc@hillvalley.edu, 555-1985 (primary)

**Request:**
```json
{
  "email": "emmet.brown@hillvalley.edu",
  "phoneNumber": "555-1985"
}
```

**Result:** Creates secondary contact linked to Contact 1. Returns consolidated info with both emails.

### Scenario 3: Linking Two Separate Customers

**Database has:**
- Contact 1: doc@hillvalley.edu, 555-1985 (primary)
- Contact 2: marty@hillvalley.edu, 555-2015 (primary)

**Request:**
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "555-2015"
}
```

**Result:** Contact 2 becomes secondary (linked to Contact 1, which is older). Returns all info consolidated under Contact 1.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Navigation with theme toggle
│   ├── HeroSection.tsx      # Landing section
│   ├── IdentifyForm.tsx     # API request form
│   ├── ResponseDisplay.tsx  # API response viewer
│   ├── DatabaseView.tsx     # Contact table view
│   ├── StatsCards.tsx       # Live statistics
│   ├── RequestHistory.tsx   # Request log
│   └── VisualDiagram.tsx    # Contact relationship tree
├── context/
│   └── ThemeContext.tsx     # Dark/light mode management
├── services/
│   └── contactService.ts    # Core identity reconciliation logic
├── types/
│   └── contact.ts           # TypeScript definitions
├── App.tsx
├── main.tsx
└── index.css
```

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Core Algorithm

The identity reconciliation follows this flow:

```
1. Receive email and/or phoneNumber
2. Search for contacts matching either value
3. If no matches → Create new primary contact
4. If matches found:
   a. Find the primary contact (oldest one)
   b. Check if request contains new information
   c. If new info → Create secondary contact
   d. If multiple primaries found → Convert newer to secondary
5. Gather all linked contacts
6. Return consolidated response
```

## Features

- Real-time contact linking simulation
- Visual relationship diagram
- Dark/light theme support
- Request history with replay
- Database state viewer
- Pre-built test scenarios

## Notes

- Phone numbers are stored as strings to preserve formatting
- The `deletedAt` field supports soft deletes (not implemented in demo)
- Primary contact is always the oldest in a linked group
- Duplicate exact matches don't create new contacts

## Future Improvements

- Persistent database storage
- Bulk import/export
- Contact search and filtering
- API rate limiting
- Webhook notifications on contact merge
- Analytics dashboard

---

Built for the Bitespeed Backend Task

