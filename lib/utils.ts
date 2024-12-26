import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const calculatePercentage = (current: number, total: number) => {
  return Math.round((current / total) * 100);
};

export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return {
    isValid: emailRegex.test(email.trim()),
    error: emailRegex.test(email.trim()) ? undefined : "Invalid email format",
  };
};

export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasMinLength) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
  if (!hasUpperCase) {
    return {
      isValid: false,
      error: "Password must contain an uppercase letter",
    };
  }
  if (!hasNumber) {
    return { isValid: false, error: "Password must contain a number" };
  }

  return { isValid: true };
};

export function formatReminderTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
