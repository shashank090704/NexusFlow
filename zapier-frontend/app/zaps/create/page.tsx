"use client";

import { useState } from "react";
import FlowCanvas from "@/components/flow/FlowCanvas";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function CreateZapPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const router = useRouter();

  async function handleCreateZap() {
    // 1️⃣ Find trigger
    const triggerNode = nodes.find((n) => n.type === "trigger");

    if (!triggerNode?.data?.availId) {
      alert("Please select a trigger");
      return;
    }

    // 2️⃣ Get actions in order (top to bottom)
    const actionNodes = nodes
      .filter((n) => n.type === "action")
      .sort((a, b) => a.id - b.id);

    if (actionNodes.length === 0) {
      alert("Please add at least one action");
      return;
    }

    // 3️⃣ Build payload
    const payload = {
      availtriggerId: triggerNode.data.availId,
      triggerMetadata: triggerNode.data.metadata || {},
      actions: actionNodes.map((a) => ({
        availActionId: a.data.availId,
        actionMetadata: a.data.metadata || {},
      })),
    };

    // 4️⃣ Save to backend
    await axiosInstance.post("/zap", payload);

    // 5️⃣ Go back to list
    router.push("/zaps");
    
  }

  return (
    <AuthGuard>
      {/* Added pt-28 and bg-fcfcfd to match the pretty theme */}
      <div className="min-h-screen pt-28 pb-10 bg-[#fcfcfd] font-sans">
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-[9px] font-black uppercase tracking-[0.3em]">Workflow Designer</span>
                <span className="text-gray-300 text-[9px]">/</span>
                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">New Flow</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Configure Engine
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/zaps")}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Discard
              </button>
              <button
                onClick={handleCreateZap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Deploy Flow
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden h-[70vh] relative">
            {/* Subtle Canvas Overlay Quote */}
            <div className="absolute bottom-6 left-8 z-10 pointer-events-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-200 italic">
                Connect nodes to define your digital rhythm
              </p>
            </div>
            
            <FlowCanvas onSave={setNodes} />
          </div>

          {/* Bottom Help Bar */}
          <div className="flex justify-between items-center px-4 opacity-50">
             <div className="flex gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Trigger Node</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Action Node</span>
                </div>
             </div>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
               Powered by Flow Engineers
             </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

// "use client";

// import { useState } from "react";
// import FlowCanvas from "@/components/flow/FlowCanvas";
// import { axiosInstance } from "@/lib/axios";
// import { useRouter } from "next/navigation";
// import AuthGuard from "@/components/AuthGuard";

// export default function CreateZapPage() {
//   const [nodes, setNodes] = useState<any[]>([]);
//   const router = useRouter();

//   async function handleCreateZap() {
//     // 1️⃣ Find trigger
//     const triggerNode = nodes.find((n) => n.type === "trigger");

//     if (!triggerNode?.data?.availId) {
//       alert("Please select a trigger");
//       return;
//     }

//     // 2️⃣ Get actions in order (top to bottom)
//     const actionNodes = nodes
//       .filter((n) => n.type === "action")
//       .sort((a, b) => a.id - b.id);

//     if (actionNodes.length === 0) {
//       alert("Please add at least one action");
//       return;
//     }

//     // 3️⃣ Build payload
//     const payload = {
//       availtriggerId: triggerNode.data.availId,
//       triggerMetadata: triggerNode.data.metadata || {},
//       actions: actionNodes.map((a) => ({
//         availActionId: a.data.availId,
//         actionMetadata: a.data.metadata || {},
//       })),
//     };

//     // 4️⃣ Save to backend
//     await axiosInstance.post("/zap", payload);

//     // 5️⃣ Go back to list
//     router.push("/zaps");
    
//   }

//   return (
//     <AuthGuard>
//       <div className="p-6 max-w-5xl mx-auto space-y-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Create Zap</h1>

//           <button
//             onClick={handleCreateZap}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Create Zap
//           </button>
//         </div>

//         <FlowCanvas onSave={setNodes} />
//       </div>
//     </AuthGuard>
//   );
// }
