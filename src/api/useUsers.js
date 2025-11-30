import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useUsers = (token) =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/accounts/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
