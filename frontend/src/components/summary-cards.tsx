"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSummary } from "@/types";
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export function SummaryCards() {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/tasks/dashboard/summary");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total", value: data?.total ?? 0, icon: ClipboardList, color: "text-slate-600" },
    { label: "A fazer", value: data?.todo ?? 0, icon: Clock, color: "text-blue-600" },
    { label: "Concluídas", value: data?.done ?? 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Atrasadas", value: data?.overdue ?? 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-500">{card.label}</CardTitle>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}