"use client";

import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { redirect , useRouter } from "next/navigation";

export default function Signup() {
    
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleGoogleLogin(){

    try{
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        window.location.href = `${backendUrl}/google`;
    }
    catch(err){
      console.log(err)
    }
  }

  async function handleSignup() {
    try {
      await axiosInstance.post("/user/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful. Please sign in.");
      router.push("/signin");
    } catch (err:any) {
      alert(err?.response?.data?.message);
    }
  }

  return (
    /* Added pt-20 to ensure content starts below the fixed navbar */
    <main className="min-h-screen pt-20 flex items-center justify-center bg-[#fcfcfd] font-sans">
      <div className="bg-white p-8 border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full max-w-[400px] mx-4">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600 w-7 h-7 rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">Flow Engine</span>
          </div>
          <h1 className="text-base font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-400 text-[11px] font-medium mt-1">
            Start automating your workflows today.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Full Name</label>
            <input
              className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Email Address</label>
            <input
              className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Password</label>
            <input
              className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl w-full text-sm transition-all active:scale-[0.97] mt-2 shadow-lg shadow-blue-100"
            onClick={handleSignup}
          >
            Get Started Free
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-[9px] font-bold tracking-[0.1em] uppercase text-gray-300"><span className="bg-white px-4">OR</span></div>
          </div>

          <button 
            className="w-full flex items-center justify-center gap-3 border border-gray-100 py-3 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.97] font-bold text-gray-600 text-xs shadow-sm" 
            onClick={()=>{handleGoogleLogin()}}
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
            Sign up with Google
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] text-gray-400 font-medium">
          Already have an account?{" "}
          <span 
            className="text-blue-600 font-bold cursor-pointer hover:underline"
            onClick={() => router.push("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { axiosInstance } from "@/lib/axios";
// import { redirect , useRouter } from "next/navigation";

// export default function Signup() {
    
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   async function handleGoogleLogin(){

//     try{
//         window.location.href = "http://localhost:5000/google";
//     }
//     catch(err){
//       console.log(err)
//     }
//   }

//   async function handleSignup() {
//     try {
//       await axiosInstance.post("/user/signup", {
//         name,
//         email,
//         password,
//       });

//       alert("Signup successful. Please sign in.");
//       router.push("/signin");
//     } catch (err:any) {
//       alert(err?.response?.data?.message);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center">
//       <div className="p-6 border rounded w-80">
//         <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

//         <input
//           className="border p-2 mb-2 w-full"
//           placeholder="Name"
//           onChange={(e) => setName(e.target.value)}
//         />

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
//           onClick={handleSignup}
//         >
//           Sign Up
//         </button>

//         <h1 className="py-2 w-full text-center">OR</h1>

//         <button className="px-4 py-1 text-white bg-gray-950 w-full center" onClick={()=>{handleGoogleLogin()}}> Google Login</button>
//       </div>
//     </main>
//   );
// }
