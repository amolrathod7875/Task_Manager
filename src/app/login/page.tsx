'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { login, signUp } from '@/app/actions/tasks';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const action = isSignUp ? signUp : login;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
    }

    if (isSignUp && !result?.error) {
      setMessage('Check your email to confirm your account!');
      setIsSignUp(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-primary">
            TaskFlow
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-xl text-gray-700 mb-6"
          >
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </motion.p>

          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="you@example.com"
                autoFocus
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your password"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}