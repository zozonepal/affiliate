import { Shield, X, Lock, Eye, FileText, CheckCircle2, Globe, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Hanken_Grotesk']">
      <div 
        className="bg-[#0B132B] text-[#dae2fd] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden"
        role="dialog"
        aria-labelledby="privacy-policy-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#131b2e] shrink-0 font-['Outfit']">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="text-base sm:text-lg font-bold text-white">
                Privacy Policy
              </h2>
              <p className="text-xs text-slate-400">
                Effective Date: 2026 | Daraz Deals Nepal (darazdeals.np)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600" />
              1. Overview and Scope
            </h3>
            <p>
              Daraz Deals Nepal ("we", "our", or "us"), accessible at <strong>dealfinder.com.np</strong>, operates as an independent price discovery, deal comparison, and product catalog platform in Nepal. We respect your privacy and are committed to protecting any personal information collected when you access our website.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              2. Information We Collect
            </h3>
            <p>We believe in minimal data collection. We collect only information necessary to deliver deal alerts and save your preferences:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Account Credentials:</strong> If you sign in via Google Authentication or email, we receive your verified email address, display name, and profile image provided by Google Identity Services.
              </li>
              <li>
                <strong>Saved Wishlists:</strong> Products saved to your wishlist are stored in your secure browser storage (localStorage) or synced with your authenticated Firebase account.
              </li>
              <li>
                <strong>Newsletter & Deal Alerts:</strong> If you opt-in to price drop notifications, your email address is registered solely for sending verified deal alerts. We never sell or share email lists.
              </li>
              <li>
                <strong>Technical Logs:</strong> Standard server logs (IP address, user agent, requested URLs) used exclusively for security diagnostics and uptime monitoring.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-600" />
              3. Affiliate Tracking and Cookie Usage
            </h3>
            <p>
              Daraz Deals Nepal participates in the Daraz Nepal Affiliate Program. When you click outward links directing to Daraz (daraz.com.np or the Daraz Mobile App):
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <p>• A standard referral cookie is placed by Daraz to credit qualifying orders to our affiliate account.</p>
              <p>• Clicking an affiliate link does NOT increase the price you pay on Daraz.</p>
              <p>• You may disable cookies at any time via your browser settings without affecting core browsing on DealFinder.</p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              4. How We Use Information
            </h3>
            <p>Collected information is used exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Synchronize your saved deals across devices upon sign-in.</li>
              <li>Deliver price drop notifications requested by you.</li>
              <li>Prevent automated scraping, abuse, and fraudulent upvoting.</li>
              <li>Comply with applicable regulations in Nepal, including the Electronic Transactions Act.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              5. Your Rights and Data Erasure
            </h3>
            <p>
              You maintain full ownership of your data. You may at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Clear your local wishlist directly in the app.</li>
              <li>Unsubscribe from deal alert emails via the one-click unsubscribe link in any message.</li>
              <li>Request full account deletion and email removal by contacting us at <strong>privacy@dealfinder.com.np</strong>.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              6. Contact and Privacy Inquiries
            </h3>
            <p className="text-slate-600">
              If you have any questions regarding this Privacy Policy or your personal information, reach out to our team at:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-mono text-slate-800">
              Email: privacy@dealfinder.com.np<br />
              Location: Kathmandu, Bagmati Province, Nepal
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2 px-5 rounded-lg transition"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
}
