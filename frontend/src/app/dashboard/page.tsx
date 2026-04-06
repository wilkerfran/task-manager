"use client";

import { Navbar } from "@/components/navbar";
import { SummaryCards } from "@/components/summary-cards";
import { TaskBoard } from "@/components/task-board";
import { TaskForm } from "@/components/task-form";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Minhas tarefas</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gerencie e acompanhe seu progresso</p>
          </div>
          <TaskForm />
        </div>
        <SummaryCards />
        <TaskBoard />
      </main>
    </div>
  );
}