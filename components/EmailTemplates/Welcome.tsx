"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Coins, Rocket } from "lucide-react";
import Link from "next/link";

interface WelcomeTemplateProps {
  name: string;
}

export const WelcomeTemplate = ({ name }: WelcomeTemplateProps): string => {
  return `
    <div>
      <h1>Welcome to SkillExchange, ${name}!</h1>
      <p>We're excited to have you join our community.</p>
      
      <h3>Here's what you can do:</h3>
      <ul>
        <li>Connect with skilled individuals</li>
        <li>Participate in challenges</li>
        <li>Earn and trade SkillCoins</li>
      </ul>
      
      <p>Get started by completing your profile!</p>
    </div>
  `;
};
