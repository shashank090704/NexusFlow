// import { useAuthStore } from "@/store/useAuthStore";
// import Image from "next/image";

// export default function Home() {

//   //const setLogin = useAuthStore((s)=> s.setLogin)
  

//   return (
    
   
//       <main className="min-h-screen flex items-center justify-center">
//         <h1 className="text-4xl font-bold">
//           Zapier Clone
//         </h1>
//       </main>
//     );
  
// }

import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  //const setLogin = useAuthStore((s)=> s.setLogin)
  

  return (
    <main className="min-h-screen bg-[#fcfcfd] relative overflow-hidden font-sans">
      {/* Background Decor: Flow Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-28 px-6 text-center">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
          <span className="text-blue-600 text-[9px] font-black tracking-[0.2em] uppercase">Web3 Enabled Automation</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
          The Engine for <br/>
          <span className="text-blue-600">Your Workflows.</span>
        </h1>

        <p className="max-w-xl text-gray-500 text-base md:text-lg font-medium leading-relaxed mb-10">
          "Don't let manual tasks stall your growth." 
          <br/>
          <span className="text-gray-400 text-xs font-semibold tracking-wide">— Seamlessly connect GitHub events to Solana payments and beyond.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            Get Started for Free
          </Link>
          <Link href="/signin" className="bg-white border border-gray-200 text-gray-800 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            Sign In to Dashboard
          </Link>
        </div>

        {/* Live Workflow Design Section */}
        <div className="relative w-full max-w-5xl mx-auto mb-20 px-4">
          <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-5 items-center gap-4 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-[2.5rem] p-8 shadow-xl">
            
            {/* Input Node: GitHub */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center shadow-sm group hover:border-blue-400 transition-all">
                 <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-8 h-8 grayscale hover:grayscale-0 transition-all" alt="GitHub" />
              </div>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">GitHub Trigger</p>
            </div>

            {/* Path */}
            <div className="hidden md:block h-[1px] bg-gradient-to-r from-gray-200 via-blue-500 to-blue-500 relative">
                <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
            </div>

            {/* Core Engine Node */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-gray-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                <div className="flex flex-col items-center gap-1 z-10">
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                   <span className="text-white font-black text-[9px] tracking-[0.2em]">LOGIC</span>
                </div>
              </div>
              <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest underline decoration-2 underline-offset-4">Flow Engine Core</p>
            </div>

            {/* Path Split */}
            <div className="hidden md:block h-[1px] bg-gradient-to-r from-blue-500 via-blue-500 to-gray-200 relative">
                <div className="absolute -top-[3px] left-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
            </div>

            {/* Multi-Output Nodes */}
            <div className="flex flex-row md:flex-col gap-4 justify-center">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                   <img src="data:image/jpeg;base64,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" className="w-6 h-6" alt="Solana" />
                </div>
                <span className="hidden lg:block text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Web3 Wallet</span>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                   <img src="data:image/jpeg;base64,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" className="w-6 h-6" alt="Sheets" />
                </div>
                <span className="hidden lg:block text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Google Sheets</span>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                   <img src="https://www.svgrepo.com/show/452213/gmail.svg" className="w-6 h-6" alt="Email" />
                </div>
                <span className="hidden lg:block text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Email Notify</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="relative z-10 text-center pb-16 px-4">
        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 italic">Verified Integrations</h3>
        <div className="flex justify-center gap-8 opacity-20 grayscale hover:grayscale-0 transition-all duration-500 items-center">
            <span className="font-bold text-sm text-gray-800 tracking-tighter">SOLANA</span>
            <span className="font-bold text-sm text-gray-800 tracking-tighter">POSTGRESQL</span>
            <span className="font-bold text-sm text-gray-800 tracking-tighter">KAFKA</span>
            <span className="font-bold text-sm text-gray-800 tracking-tighter">REDIS</span>
        </div>
      </footer>
    </main>
  );
}