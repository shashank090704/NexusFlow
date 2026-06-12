"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ZapRow({ zap }: { zap: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const triggerIcon = zap.trigger?.type?.image;
  const triggerName = zap.trigger?.type?.name;
  const runCount = zap.zapRuns?.length || 0;
  const hooksBaseUrl = process.env.NEXT_PUBLIC_HOOKS_URL || "http://localhost:3001";

  return (
    <div className={`group border rounded-2xl transition-all mb-3 overflow-hidden ${open ? "border-blue-300 shadow-sm bg-[#fcfcfd]" : "border-gray-100 bg-white hover:border-gray-300"}`}>
      
      {/* Main Row Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-6">
          {/* Icons Path */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5">
               <img className="w-full h-full object-contain" src={triggerIcon} />
            </div>
            <span className="text-gray-300 text-xs">→</span>
            <div className="flex -space-x-2">
              {zap.actions.map((a: any, i: number) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1.5 shadow-sm" style={{zIndex: 10-i}}>
                  <img className="w-full h-full object-contain" src={a.type.image} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 tracking-tight">{triggerName || "Untitled Flow"}</span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{zap.actions.length} Actions Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Activity</p>
            <p className="text-xs font-black text-gray-900">{runCount} Runs</p>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${open ? "bg-blue-600 text-white rotate-180" : "bg-gray-100 text-gray-400"}`}>
            <span className="text-[10px]">▼</span>
          </div>
        </div>
      </div>

      {/* Expanded Control Panel */}
      {open && (
        <div className="border-t border-gray-100 px-6 py-5 bg-white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            
            {/* 1. Webhook Section */}
            <div className="flex-1 min-w-[300px]">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Listener URL</h4>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-xl">
                <code className="text-[10px] font-mono text-blue-600 truncate flex-1 pl-2">
                  {hooksBaseUrl}/hooks/catch/1/{zap.id}
                </code>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${hooksBaseUrl}/hooks/catch/1/${zap.id}`);
                  }}
                  className="bg-white border border-gray-200 text-[9px] font-black px-3 py-1.5 rounded-lg hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  COPY
                </button>
              </div>
            </div>

            {/* 2. Refined History Button */}
            <div className="flex items-center gap-3">
               <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/zap/${zap.id}`);
                  }}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
               >
                  <span className="opacity-70">📊</span>
                  View History
               </button>
               
               <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-100 group/del transition-all">
                  <span className="text-[11px] grayscale group-hover/del:grayscale-0">🗑️</span>
               </button>
            </div>
          </div>

          {/* Logic Summary Mini-Line */}
          <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3">
             <span className="text-[9px] font-black text-gray-300 uppercase italic">Pipeline Status: Functional</span>
             <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}