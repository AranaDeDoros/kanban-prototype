import { useMutation/* , useQueryClient  */} from "@tanstack/react-query";
import api from "./client";

export const useCreateTask = (token) =>
  useMutation({
    mutationFn: async (data) => {
      const isFormData = data instanceof FormData;

      const res = await api.post("/tasks/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });

      return res.data;
    },
  });
