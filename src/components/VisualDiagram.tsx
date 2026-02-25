import { Contact } from '../types/contact';

interface VisualDiagramProps {
  contacts: Contact[];
}

export function VisualDiagram({ contacts }: VisualDiagramProps) {
  if (contacts.length === 0) {
    return null;
  }

  // Group contacts by their primary
  const primaryContacts = contacts.filter(c => c.linkPrecedence === 'primary');
  
  const getSecondaries = (primaryId: number) => {
    return contacts.filter(c => c.linkedId === primaryId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Contact Links Visualization
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visual representation of linked contacts</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-8">
          {primaryContacts.map(primary => {
            const secondaries = getSecondaries(primary.id);
            
            return (
              <div key={primary.id} className="relative">
                {/* Primary Contact Node */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-xl p-4 text-white shadow-lg min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-bold">Primary #{primary.id}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="opacity-75">📧</span>
                          <span className="truncate">{primary.email || 'null'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="opacity-75">📱</span>
                          <span>{primary.phoneNumber || 'null'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection line */}
                    {secondaries.length > 0 && (
                      <div className="absolute left-1/2 top-full h-4 w-0.5 bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                </div>
                
                {/* Secondary Contacts */}
                {secondaries.length > 0 && (
                  <div className="ml-8 mt-4 relative">
                    {/* Horizontal connector line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" style={{ width: `${Math.min(secondaries.length * 220, 800)}px` }} />
                    
                    <div className="flex flex-wrap gap-4 pt-4">
                      {secondaries.map((secondary) => (
                        <div key={secondary.id} className="relative">
                          {/* Vertical connector */}
                          <div className="absolute left-1/2 -top-4 h-4 w-0.5 bg-gray-300 dark:bg-gray-600" />
                          
                          <div className="bg-gradient-to-br from-orange-300 to-amber-400 dark:from-orange-400 dark:to-amber-500 rounded-xl p-4 text-white shadow-md min-w-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-white/20 rounded px-1.5 py-0.5">
                                → #{primary.id}
                              </span>
                              <span className="font-bold text-sm">Secondary #{secondary.id}</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="opacity-75">📧</span>
                                <span className="truncate">{secondary.email || 'null'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="opacity-75">📱</span>
                                <span>{secondary.phoneNumber || 'null'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 uppercase tracking-wide">Legend</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Primary Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-300 to-amber-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secondary Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Linked to Primary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
