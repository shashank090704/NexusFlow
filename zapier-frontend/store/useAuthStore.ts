import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface User{
  id : string;
  email:string;
  name:string;
  oAuth:{provider:string} | null;
}

type AuthState = {
  user:User | null;
  isLoggedIn: boolean;
  isLoading: boolean,
  checkAuth: ()=>Promise<void>;
  logout: ()=>Promise<void>;
};

export const useAuthStore = create<AuthState>((set)=>({
    isLoggedIn:false,
    isLoading: true,
    user:null,

    checkAuth : async ()=>{
      try{
        const res = await axiosInstance.get("/me",{
          withCredentials:true
        })

        if(res.status){
          set({ isLoggedIn: true, isLoading: false , user:res.data});
        }
        else{
          set({ isLoggedIn: false, isLoading: false });
        }
      }
      catch{
        set({ isLoggedIn: false, isLoading: false });
      }


    },

    logout : async()=>{
        await axiosInstance.post("/user/logout",{
          withCredentials:true
      })
      set({isLoggedIn:false,user:null})
    }
}))



/* when local storage

type AuthState = {
  isLoggedIn: boolean;
  setLogin: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: typeof window !== "undefined"
    ? !!localStorage.getItem("token")
    : false,

  setLogin: () => set({ isLoggedIn: true }),

  logout: () => {
    localStorage.removeItem("token");
    set({ isLoggedIn: false });
  },
}));*/
