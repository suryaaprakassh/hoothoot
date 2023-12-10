"use client";
import { useAxios } from "@/lib/axios";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
const useAuth = (): boolean => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  useLayoutEffect(() => {
    const func = async () => {
      try {
        setLoading(true);
        await useAxios.post("/auth/verify");
      } catch (error: any) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    func();
  }, []);

  return loading;
};

export default useAuth;
