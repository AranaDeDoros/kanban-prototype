import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useUser = (token) =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get(`/accounts/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
