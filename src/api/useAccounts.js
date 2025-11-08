import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useAccounts = (token) =>
  useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await api.get("/accounts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
