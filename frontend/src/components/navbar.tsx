"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, CheckSquare } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-slate-800">Task Manager</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Olá, {user?.username}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1" />
          Sair
        </Button>
      </div>
    </header>
  );
}