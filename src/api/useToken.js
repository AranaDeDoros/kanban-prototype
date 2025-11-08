// src/api/useToken.js
import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useToken = () =>
  useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const res = await api.post(
        "auth/login/",
        {
          username: "admin",
          password: "123456",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
  });
