"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/navigation";

export default function SignInPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const toastShown = useRef(false);
  useEffect(() => {
    if (user && !loading) {
      const redirectTo =
        new URLSearchParams(window.location.search).get("from") || "/";
      router.push(redirectTo);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message && !toastShown.current) {
      toast.error(message);
      toastShown.current = true;
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful! Redirecting...");
    } catch (error: any) {
      console.log(error);
      switch (error.message) {
        case "Email not confirmed":
          toast.error("Please verify your email before signing in.");
          break;
        default:
          toast.error(`${error.message || "An error occurred"}. Please try again later.`);
      }
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 bg-primary/10 text-primary flex flex-col justify-center p-12"
      >
        <h1 className="text-4xl font-bold mb-6">
          Welcome Back to SkillExchange!
        </h1>
        <p className="text-xl mb-8">
          Sign in to access your account and continue your skill-trading
          journey.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Check your SkillCoin balance</li>
          <li>Browse the latest skill offerings</li>
          <li>Participate in ongoing challenges</li>
          <li>Connect with your network of skilled individuals</li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 flex items-center justify-center p-12"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-semibold">Sign In</CardTitle>
              <ThemeToggle />
            </div>
            <CardDescription>Access your SkillExchange account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
