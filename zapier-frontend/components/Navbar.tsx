// "use client";

// import { useAuthStore } from "@/store/useAuthStore";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function Navbar() {
//   const router = useRouter();
//    const { isLoggedIn, logout } = useAuthStore();

  

//   async function handleLogout() {
//     await logout()
   
//     router.push("/signin");
//   }

//   return (
//     <nav className="flex justify-between items-center px-6 py-4 border-b">
//       <Link href="/" className="font-bold text-lg">
//         Zapier Clone
//       </Link>

//       <div className="space-x-4">
//         {!isLoggedIn && (
//           <>
//             <Link href="/signin">Sign In</Link>
//             <Link href="/signup">Sign Up</Link>
//           </>
//         )}

//         {isLoggedIn && (
//           <button onClick={handleLogout}>
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  async function handleLogout() {
    await logout()
   
    router.push("/signin");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md border-b border-gray-100">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group transition-all">
        <div className="bg-blue-600 w-7 h-7 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-blue-100">
          <span className="text-white font-black text-sm">F</span>
        </div>
        <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">
          Flow Engine
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {!isLoggedIn && (
          <>
            <Link 
              href="/signin" 
              className="text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-gray-900 text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 uppercase tracking-widest"
            >
              Get Started
            </Link>
          </>
        )}

        {isLoggedIn && (
          <div className="flex items-center gap-6">
            <Link 
              href="/zaps" 
              className="text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Workflows
            </Link>
            <button 
              onClick={handleLogout}
              className="text-[13px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest border border-red-50 border-transparent hover:border-red-100 px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
