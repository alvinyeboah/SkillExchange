'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SnowflakeIcon as Confetti } from 'lucide-react';

interface WelcomeTemplateProps {
  name: string;
  verificationLink?: string;
}

export const WelcomeTemplate: React.FC<WelcomeTemplateProps> = ({
  name,
  verificationLink,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Confetti className="w-16 h-16 mx-auto mb-4" />
        </motion.div>
        <CardTitle className="text-2xl font-bold text-center">Welcome to Our Platform!</CardTitle>
      </CardHeader>
      <CardContent className="mt-6 space-y-4">
        <motion.p
          className="text-lg font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Hello {name},
        </motion.p>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          We're thrilled to have you on board! Get ready to explore amazing features and connect with a vibrant community.
        </motion.p>
        {verificationLink && (
          <motion.div
            className="bg-muted p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm font-medium mb-2">One last step:</p>
            <p className="text-sm text-muted-foreground mb-4">
              Please verify your email to unlock all features of your account.
            </p>
            <Button asChild className="w-full">
              <a href={verificationLink}>Verify Email</a>
            </Button>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-center text-muted-foreground">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </CardFooter>
    </Card>
  );
};

