import { FileText, X, Scale, AlertTriangle, ShieldCheck, Globe, ShoppingBag, Mail } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsAndConditionsModal({ isOpen, onClose }: TermsAndConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Hanken_Grotesk']">
      <div 
        className="bg-[#0B132B] text-[#dae2fd] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden"
        role="dialog"
        aria-labelledby="terms-conditions-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#131b2e] shrink-0 font-['Outfit']">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 id="terms-conditions-title" className="text-base sm:text-lg font-bold text-white">
                Terms and Conditions
              </h2>
              <p className="text-xs text-slate-400">
                Last Updated: 2026 | Daraz Deals Nepal (darazdeals.np)
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
              1. Agreement to Terms
            </h3>
            <p>
              By accessing and using Daraz Deals Nepal (available at <strong>dealfinder.com.np</strong>), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please discontinue using this website.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              2. Nature of Service and Affiliate Relationship
            </h3>
            <p>
              Daraz Deals Nepal is an independent deal curation and product discovery service. We do not sell, stock, pack, or ship any merchandise directly. All products listed on this site link to third-party merchant platforms, primarily <strong>Daraz Nepal (daraz.com.np)</strong>.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <p>• We participate in the Daraz Affiliate Program and earn a commission on qualifying purchases.</p>
              <p>• Our editorial curation is independent; products are indexed based on discount depth, seller reputation, and value for consumers in Nepal.</p>
              <p>• Prices and discounts displayed reflect available rates at the time of catalog update and are subject to merchant change.</p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              3. Pricing & Availability Accuracy
            </h3>
            <p>
              While we continuously verify deal accuracy, prices and stock on Daraz Nepal fluctuate dynamically due to seller price updates and stock exhaustion. Daraz Deals Nepal makes no guarantee that any listed deal will remain at the indicated price when you visit the merchant website. Always verify final checkout pricing on Daraz before completing any transaction.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              4. Orders, Fulfillment, and Warranties
            </h3>
            <p>
              All purchases made via external links are transactions solely between you and the respective Daraz seller or Daraz Mall merchant. Daraz Deals Nepal is not responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Order dispatch, courier transit delays, or delivery issues across Nepal.</li>
              <li>Product defects, return requests, or warranty claims.</li>
              <li>Billing discrepancies or payment disputes on Daraz.</li>
            </ul>
            <p className="text-xs text-slate-500">
              For any customer support inquiries relating to an order, please contact Daraz Nepal Customer Care directly via the Daraz App or help center.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-600" />
              5. Intellectual Property
            </h3>
            <p>
              The Daraz Deals Nepal name, logo, custom user interface design, and curated content are the property of Daraz Deals Nepal. Product names, trademarks, logos, and product imagery displayed belong to their respective brand owners and sellers on Daraz Nepal.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-600" />
              6. Governing Law and Jurisdiction
            </h3>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of Nepal. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Kathmandu, Nepal.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              7. Inquiries and Contact
            </h3>
            <p className="text-slate-600">
              For legal notices, deal corrections, or trademark questions, please contact:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-mono text-slate-800">
              Email: legal@dealfinder.com.np<br />
              Entity: Daraz Deals Nepal Digital Media, Kathmandu, Nepal
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2 px-5 rounded-lg transition"
          >
            Acknowledge Terms
          </button>
        </div>
      </div>
    </div>
  );
}
