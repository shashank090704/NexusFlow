"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import AuthGuard from "@/components/AuthGuard";
import { useParams, useRouter } from "next/navigation";

interface Zap {
  id: string;
  actions: {
    actionMetadata: any; // Static config from your ConfigPanel
    type: { 
      name: string;
      image?: string; 
    };
  }[];
  trigger: {
    type: { 
      name: string; 
      image: string; 
    };
  };
}

const IconMap: Record<string, string> = {
  "Email": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
  "Solana": "https://cryptologos.cc/logos/solana-sol-logo.svg",
  "Google Sheets": "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
};

export default function ZapRunPage() {
  const [zap, setZap] = useState<Zap | null>(null);
  const [metadata, setMetadata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const zapid = params.zapid as string;

  useEffect(() => {
    async function fetchZapDetails() {
      try {
        const res = await axiosInstance.get(`/zap/${zapid}`);
        setZap(res.data.zap);
        setMetadata(res.data.zapRunMetadata);
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setLoading(false);
      }
    }
    fetchZapDetails();
  }, [zapid]);

  return (
    <AuthGuard>
      <main className="min-h-screen pt-28 pb-12 px-6 max-w-5xl mx-auto font-sans bg-[#fcfcfd]">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <button 
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors mb-4 flex items-center gap-2"
            >
              ← Back to Flows
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">System Log</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              Flow Intelligence
            </h1>
          </div>
          <div className="text-right pb-1">
             <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-widest block">ID: {zapid}</span>
          </div>
        </div>

        {/* SECTION 1: ZAP BLUEPRINT (STATIC CONFIGURATION) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {zap?.actions.map((action, i) => (
             <div key={i} className="bg-white border-2 border-gray-50 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative group">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100">
                      <img src={action.type.image || IconMap[action.type.name]} className="w-full h-full object-contain" />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Action Step {i + 1}</p>
                      <h3 className="text-sm font-black text-gray-900 uppercase italic leading-tight">{action.type.name}</h3>
                   </div>
                </div>

                <div className="space-y-3">
                   {Object.entries(action.actionMetadata || {}).map(([key, value]) => (
                     <div key={key} className="border-b border-gray-50 last:border-0 pb-2">
                        <label className="block text-[8px] font-black text-gray-300 uppercase tracking-tighter mb-0.5">{key}</label>
                        <p className="text-[10px] font-bold text-gray-600 truncate italic">
                           {String(value)}
                        </p>
                     </div>
                   ))}
                   {(!action.actionMetadata || Object.keys(action.actionMetadata).length === 0) && (
                     <p className="text-[10px] text-gray-300 italic">No variables mapped</p>
                   )}
                </div>
             </div>
           ))}
        </div>

        {/* SECTION 2: EXECUTION LOGS (DYNAMIC RUNS) */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          
          <div className="grid grid-cols-12 px-8 py-5 bg-gray-50/50 border-b border-gray-100">
             <span className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-400">Instance</span>
             <span className="col-span-3 text-[9px] font-black uppercase tracking-widest text-gray-400">Logic Chain</span>
             <span className="col-span-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Run Metadata</span>
             <span className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Status</span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-gray-400 font-black uppercase text-[10px] tracking-widest">
                Connecting to Kafka Streams...
              </div>
            ) : metadata.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Waitng for first trigger...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {metadata.map((run, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-6 py-5 hover:bg-gray-50/80 rounded-2xl transition-all border border-transparent hover:border-gray-100 items-center">
                    
                    <div className="col-span-2">
                      <p className="text-[11px] font-bold text-gray-900 tracking-tighter">RUN_#{(metadata.length - idx).toString().padStart(3, '0')}</p>
                      <p className="text-[9px] text-green-600/60 font-black uppercase tracking-tighter italic">Verified</p>
                    </div>

                    <div className="col-span-3 flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center p-1.5 shadow-sm">
                          <img src={zap?.trigger.type.image} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-gray-300 text-xs">→</span>
                        <div className="flex -space-x-1.5">
                          {zap?.actions.map((action, i) => (
                            <div key={i} className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-1.5 shadow-sm relative" style={{ zIndex: 10 - i }}>
                              <img src={action.type.image || IconMap[action.type.name]} className="w-full h-full object-contain" />
                            </div>
                          ))}
                        </div>
                    </div>

                    <div className="col-span-5 px-2">
                      <div className="bg-gray-50/80 border border-gray-200/50 p-3 rounded-2xl grid grid-cols-1 gap-y-1">
                        {Object.entries(run).map(([key, value]) => {
                          if (['id', 'zapRunId', 'createdAt', 'updatedAt'].includes(key)) return null;
                          const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                          return (
                            <div key={key} className="flex items-center gap-2 overflow-hidden border-b border-gray-100/50 last:border-0 pb-0.5 mb-0.5">
                              <span className="text-[8px] font-black uppercase text-blue-600/50 min-w-[65px] tracking-tight">
                                {cleanKey}:
                              </span>
                              <span className="text-[10px] font-mono font-bold text-gray-700 truncate">
                                {typeof value === 'string' && value.length > 25 
                                  ? `${value.slice(0, 10)}...${value.slice(-6)}` 
                                  : String(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                          Complete
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center opacity-30">
           <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
             Process Stack: <span className="text-blue-600 font-mono tracking-normal">Kafka-Cluster-Outbox-v1</span>
           </p>
           <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
             Status: <span className="text-gray-900 tracking-normal italic">All Systems Operational</span>
           </p>
        </div>
      </main>
    </AuthGuard>
  );
}