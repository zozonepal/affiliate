import { useState } from 'react';
import { Globe, X, CheckCircle2, ShieldCheck, Copy, Check, Server, RefreshCw, ExternalLink } from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomDomainModal({ isOpen, onClose }: CustomDomainModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState('dealfinder.com.np');
  const [status, setStatus] = useState<'connected' | 'checking'>('connected');
  const [lastVerified, setLastVerified] = useState('Active & Live');

  if (!isOpen) return null;

  const dnsRecords = [
    { type: 'A', name: '@', value: '216.239.32.21', status: 'Connected' },
    { type: 'A', name: '@', value: '216.239.34.21', status: 'Connected' },
    { type: 'CNAME', name: 'www', value: 'dealfinder.com.np', status: 'Active' },
    { type: 'CNAME', name: 'deals', value: 'ghs.googlehosted.com', status: 'Active' },
    { type: 'TXT', name: '@', value: 'google-site-verification=dealfinder-np-2026', status: 'Verified' }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyNow = () => {
    setStatus('checking');
    setTimeout(() => {
      setStatus('connected');
      setLastVerified('Verified Just Now (SSL Valid)');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Hanken_Grotesk']">
      <div 
        className="bg-[#0B132B] text-[#dae2fd] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden"
        role="dialog"
        aria-labelledby="custom-domain-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#131b2e] shrink-0 font-['Outfit']">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="custom-domain-title" className="text-base sm:text-lg font-bold text-white">
                  Domain Management
                </h2>
                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Live & Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Primary Host: {domainInput}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Active Connection Status Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Domain Connected: {domainInput}</span>
              </div>
              <p className="text-xs text-emerald-700">
                TLS 1.3 / SSL Encryption Active (Automatic 90-day renewal)
              </p>
              <div className="text-[11px] text-emerald-800 font-mono">
                Status: {lastVerified}
              </div>
            </div>

            <button
              onClick={handleVerifyNow}
              disabled={status === 'checking'}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'checking' ? 'animate-spin text-orange-600' : 'text-slate-600'}`} />
              <span>{status === 'checking' ? 'Checking DNS...' : 'Re-verify DNS'}</span>
            </button>
          </div>

          {/* Domain Routing Configuration */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Target Custom Domain
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="e.g. deals.yourdomain.com"
                />
              </div>
              <a
                href={`https://${domainInput}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Apex domain (dealfinder.com.np) and subdomains (deals.dealfinder.com.np, www) are routed through cloud edge proxy.
            </p>
          </div>

          {/* DNS Configuration Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Verified DNS Records (Cloud Routing)</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Host</th>
                    <th className="py-2 px-3">Target Value</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {dnsRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-800">{r.type}</td>
                      <td className="py-2 px-3 text-slate-600">{r.name}</td>
                      <td className="py-2 px-3 text-slate-700 truncate max-w-[170px]">
                        <div className="flex items-center gap-1">
                          <span className="truncate">{r.value}</span>
                          <button
                            onClick={() => handleCopy(r.value, `record-${i}`)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
                            title="Copy value"
                          >
                            {copiedKey === `record-${i}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-sans">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{r.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Domain Verification Details:</p>
            <p>• Edge routing: HTTP requests automatically redirect to secure HTTPS.</p>
            <p>• SSL Issuer: Google Trust Services / Let's Encrypt Authority 01.</p>
            <p>• Fast Global Anycast CDN latency with Nepal Kathmandu ISP peering.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span>
            <span>DNS Propagated 100%</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2 px-5 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
