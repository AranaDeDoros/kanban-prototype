import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";

export const useCreateTask = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectDTO) => {
      const res = await api.post(
        "/tasks/",
        {
          title: projectDTO.title,
          description: projectDTO.description,
          status: projectDTO.status,
          project: projectDTO.project,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // Opcional: refresca las tareas después de crear una
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
