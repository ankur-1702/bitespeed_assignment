export function InfoSection() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-6">
      <div className="flex items-start gap-4">
        <div className="bg-amber-100 dark:bg-amber-800/50 rounded-xl p-3 flex-shrink-0">
          <span className="text-3xl">🧪</span>
        </div>
        <div>
          <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">About This Demo</h3>
          <p className="text-amber-800 dark:text-amber-300/80 text-sm leading-relaxed mb-4">
            This is a frontend simulation of the Bitespeed Identity Reconciliation service. 
            Dr. Emmett "Doc" Brown uses FluxKart.com with different contact information to avoid 
            detection while building his time machine. This service links all his identities together!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
              <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-1">🔗 How Linking Works</h4>
              <p className="text-amber-700 dark:text-amber-400/80 text-xs">
                Contacts are linked if they share an email OR phone number. The oldest contact becomes "primary".
              </p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
              <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-1">⚡ Primary → Secondary</h4>
              <p className="text-amber-700 dark:text-amber-400/80 text-xs">
                When two primary contacts are linked, the newer one becomes secondary to the older one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
