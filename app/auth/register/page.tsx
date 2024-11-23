'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { validateEmail, validatePassword } from '@/lib/utils'
import { register } from '@/lib/api'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [email, setEmail] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (username.length === 0) {
      newErrors.username = 'Username is required';
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await register({ email, password, username });
        toast.success("Registration successful!")
        window.location.href = '/auth/signin'; 

      } catch (error: any) {
        console.error('Registration error:', error.message);
        toast.error("An error occurred during registration")
        setErrors({ server: error.message }); 
      }
    } else {
      setErrors(newErrors);
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 bg-teal-50 text-teal-900 flex flex-col justify-center p-12"
      >
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>
        <p className="text-xl mb-8">Create an account to get started on your journey with us.</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access exclusive content</li>
          <li>Connect with like-minded individuals</li>
          <li>Track your progress</li>
          <li>Personalized recommendations</li>
        </ul>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 bg-white flex items-center justify-center p-12"
      >
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition duration-300"
            >
              Register
            </motion.button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-teal-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
