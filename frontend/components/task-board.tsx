"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task, TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { MoreVertical, Trash2, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusLabel: Record<TaskStatus, string> = {
  todo: "A fazer",
  in_progress: "Em andamento",
  done: "Concluída",
};

const priorityColor = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const priorityLabel = { low: "Baixa", medium: "Média", high: "Alta" };

export function TaskBoard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const handleStatusChange = (value: string | null) => setStatusFilter(value ?? "all");
  const handlePriorityChange = (value: string | null) => setPriorityFilter(value ?? "all");

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", search, statusFilter, priorityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);
      const res = await api.get(`/tasks/?${params}`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      api.patch(`/tasks/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Erro ao atualizar tarefa"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Tarefa removida");
    },
    onError: () => toast.error("Erro ao remover tarefa"),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="todo">A fazer</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="done">Concluídas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && tasks?.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">Nenhuma tarefa encontrada</p>
          <p className="text-sm mt-1">Crie sua primeira tarefa clicando em &quot;Nova tarefa&quot;</p>
        </div>
      )}

      <div className="space-y-3">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="bg-white border rounded-xl p-4 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>
                  {priorityLabel[task.priority]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {statusLabel[task.status]}
                </Badge>
              </div>
              <p className={`font-medium text-slate-800 truncate ${task.status === "done" ? "line-through text-slate-400" : ""}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-slate-500 mt-0.5 truncate">{task.description}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {formatDistanceToNow(new Date(task.created_at + "Z"), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="p-2 rounded-md hover:bg-slate-100 cursor-pointer text-slate-500">
                  <MoreVertical className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {task.status !== "in_progress" && (
                  <DropdownMenuItem
                    onClick={() => updateMutation.mutate({ id: task.id, status: "in_progress" })}
                  >
                    Mover para em andamento
                  </DropdownMenuItem>
                )}
                {task.status !== "done" && (
                  <DropdownMenuItem
                    onClick={() => updateMutation.mutate({ id: task.id, status: "done" })}
                  >
                    Marcar como concluída
                  </DropdownMenuItem>
                )}
                {task.status !== "todo" && (
                  <DropdownMenuItem
                    onClick={() => updateMutation.mutate({ id: task.id, status: "todo" })}
                  >
                    Voltar para a fazer
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => deleteMutation.mutate(task.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}