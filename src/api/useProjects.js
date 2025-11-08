import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useProjects = (token) =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
