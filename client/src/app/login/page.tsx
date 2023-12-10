"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAxios } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Not a valid email" }),
  password: z.string().min(6, {
    message: "Password must be atleast 6 characters",
  }),
});
const Login = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await useAxios.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
        router.push("/");
      } else {
        toast.error(res.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Password..."
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
