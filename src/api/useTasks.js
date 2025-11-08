import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useTasks = (projectId, token) =>
  useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/?project=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!projectId && !!token,
  });
