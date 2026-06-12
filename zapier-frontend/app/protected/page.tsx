"use client";

import AuthGuard from "@/components/AuthGuard";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          You are logged in 🎉
        </h1>
      </main>
    </AuthGuard>
  );
}
