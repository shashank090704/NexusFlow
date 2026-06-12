"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //const setLogin = useAuthStore((s)=> s.setLogin)
  const  {isLoading,isLoggedIn} = useAuthStore()

  async function handleGoogleLogin(){

    try{
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        window.location.href = `${backendUrl}/google`;
    }
    catch(err){
      console.log(err)
    }
  }


  async function handleSignin() {
    try {
      const res = await axiosInstance.post("/user/signin", {
        email,
        password,
      });

      // backend returns { token }
      //const token = res.data.token;

      // store token in browser
      //localStorage.setItem("token", token);
      //setLogin()

      // temporary redirect
      router.push("/zaps");
    } catch (err: any) {
      alert(`Invalid credentials : ${err.response?.data?.message}`);
    }
  }

  return (
    /* Added pt-20 to clear the fixed navbar */
    <main className="min-h-screen pt-20 flex items-center justify-center bg-[#fcfcfd] font-sans">
      <div className="bg-white p-8 border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full max-w-[380px] mx-4">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600 w-7 h-7 rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">FLOW ENGINE</span>
          </div>
          <p className="text-gray-400 text-[11px] font-semibold italic">
            "Your ideas, automated."
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Account Email</label>
            <input
              className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
               <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
               <span className="text-[9px] font-bold text-blue-600 cursor-pointer">Forgot?</span>
            </div>
            <input
              className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl w-full text-sm transition-all active:scale-[0.97] mt-2 shadow-lg shadow-blue-100"
            onClick={handleSignin}
          >
            Launch Engine
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-[9px] font-bold tracking-[0.1em] uppercase text-gray-300"><span className="bg-white px-4 italic">Secure Gateway</span></div>
          </div>

          <button 
            className="w-full flex items-center justify-center gap-3 border border-gray-100 py-3 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.97] font-bold text-gray-600 text-xs shadow-sm" 
            onClick={()=>{handleGoogleLogin()}}
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] text-gray-400 font-medium leading-relaxed">
          Need a new workspace? <br/>
          <span 
            className="text-blue-600 font-bold cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Create an account
          </span>
        </p>
      </div>
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { axiosInstance } from "@/lib/axios";
// import { useAuthStore } from "@/store/useAuthStore";

// export default function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();
//   //const setLogin = useAuthStore((s)=> s.setLogin)
//   const  {isLoading,isLoggedIn} = useAuthStore()

//   async function handleGoogleLogin(){

//     try{
//         window.location.href = "http://localhost:5000/google";
//     }
//     catch(err){
//       console.log(err)
//     }
//   }


//   async function handleSignin() {
//     try {
//       const res = await axiosInstance.post("/user/signin", {
//         email,
//         password,
//       });

//       // backend returns { token }
//       //const token = res.data.token;

//       // store token in browser
//       //localStorage.setItem("token", token);
//       //setLogin()

//       // temporary redirect
//       router.push("/");
//     } catch (err: any) {
//       alert(`Invalid credentials : ${err.response?.data?.message}`);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center">
//       <div className="p-6 border rounded w-80">
//         <h1 className="text-2xl font-bold mb-4">Sign In</h1>

//         <input
//           className="border p-2 mb-2 w-full"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="border p-2 mb-4 w-full"
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           className="bg-black text-white px-4 py-2 w-full"
//           onClick={handleSignin}
//         >
//           Sign In
//         </button>
//         <h1 className="py-2 w-full text-center">OR</h1>

//         <button className="px-4 py-1 text-white bg-gray-950 w-full center" onClick={()=>{handleGoogleLogin()}}> Google Login</button>
      
//       </div>
//     </main>
//   );
// }


