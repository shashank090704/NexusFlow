"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import AuthGuard from "@/components/AuthGuard";
import ZapRow from "@/components/zaps/ZapRow";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";


interface Zap{
    "id":string,
    "triggerId" : string,
    "userId":number,
    "actions":{
        "id" : string,
        "zapId":string,
        "sortingOrder":number,
        "type":{
            "id" : string,
            "name" : string
        }
    }[],
    "trigger": {
        type: {
            id: string;
            name: string;
            image: string;
        };
    },
    "zapRuns": any 

}

export default function ZapsPage() {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const router = useRouter();
  const {user} = useAuthStore()

  useEffect(() => {
    async function fetchZaps() {
      const res = await axiosInstance.get("/zap");
      //console.log(res.data)
      setZaps(res.data.zaps);
    }
    fetchZaps();
  }, []);
  //{console.log(2,user)}
  
  return (
    <AuthGuard>
      {/* Added pt-28 to ensure clearance for the fixed Navbar */}
      <main className="min-h-screen pt-28 pb-12 px-6 max-w-5xl mx-auto font-sans bg-[#fcfcfd]">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Active Workspaces</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">My Flows</h1>
          </div>

          <button
            onClick={() => router.push("/zaps/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Create Flow</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          
          {/* Table Header Decoration */}
          <div className="grid grid-cols-12 px-8 py-4 bg-gray-50/50 border-b border-gray-100">
             <span className="col-span-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Workflow Name</span>
             <span className="col-span-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Trigger / Actions</span>
             <span className="col-span-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Status</span>
          </div>

          <div className="p-4">
            {zaps.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                   <span className="text-gray-300">∅</span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">No flows created yet.</p>
                <button 
                  onClick={() => router.push("/zaps/create")}
                  className="mt-4 text-blue-600 text-xs font-black underline underline-offset-4"
                >
                  Configure your first engine
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {zaps.map((zap) => (
                  <div key={zap.id} className="group transition-all duration-200">
                    <ZapRow zap={zap} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Technical Stat Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center opacity-40">
           <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
             Connected to Kafka Node: <span className="text-blue-600 tracking-normal">cluster-01</span>
           </p>
           <div className="flex gap-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PostgreSQL</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Solana Mainnet</span>
           </div>
        </div>
      </main>
    </AuthGuard>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { axiosInstance } from "@/lib/axios";
// import AuthGuard from "@/components/AuthGuard";
// import ZapRow from "@/components/zaps/ZapRow";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useAuthStore";


// interface Zap{
//     "id":string,
//     "triggerId" : string,
//     "userId":number,
//     "actions":{
//         "id" : string,
//         "zapId":string,
//         "sortingOrder":number,
//         "type":{
//             "id" : string,
//             "name" : string
//         }
//     }[],
//     "trigger": {
//         type: {
//             id: string;
//             name: string;
//             image: string;
//         };
//     },
//     "zapRuns": any 

// }

// export default function ZapsPage() {
//   const [zaps, setZaps] = useState<Zap[]>([]);
//   const router = useRouter();
//   const {user} = useAuthStore()

//   useEffect(() => {
//     async function fetchZaps() {
//       const res = await axiosInstance.get("/zap");
//       //console.log(res.data)
//       setZaps(res.data.zaps);
//     }
//     fetchZaps();
//   }, []);
//   //{console.log(2,user)}
//   return (
//     <AuthGuard>
      
//       <main className="p-6 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">My Zaps</h1>

//           <button
//             onClick={() => router.push("/zaps/create")}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             + Create Zap
//           </button>
//         </div>

//         {/* List */}
//         <div className="space-y-2">
//           {zaps.length === 0 && (
//             <p className="text-gray-500">No zaps created yet.</p>
//           )}

//           {zaps.map((zap) => (
//             <ZapRow key={zap.id} zap={zap} />
//           ))}
//         </div>
//       </main>
//     </AuthGuard>
//   );
// }
