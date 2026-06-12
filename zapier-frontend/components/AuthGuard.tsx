"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const checkAuth = useAuthStore((s)=> s.checkAuth)

  const {isLoading,isLoggedIn} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  useEffect(() => {
    

    if (!isLoading && !isLoggedIn) {
      router.replace("/signin");
    } 
  }, [isLoggedIn,router,isLoading]);

  if (isLoading) {
    return <p className="p-6">Checking authentication...</p>;
  }

  return <>{children}</>;
}
