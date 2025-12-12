import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useTags = (token) =>
  useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await api.get("/tags/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
