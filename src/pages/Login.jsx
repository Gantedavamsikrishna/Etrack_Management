import React, { useState } from 'react';
import { Laptop2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.log('Toast triggered: Missing email or password');
      toast.error('Please enter both email and password.', {
        position: "top-right",
        autoClose: 3000,
        theme: 'dark',
      });
      return;
    }

    try {
      const success = await login(email, password);
      console.log('Login response:', success); // Debug the return value
      if (success?.success || success === true) { // Handle object or boolean
        console.log('Toast triggered: Login successful');
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          theme: 'dark',
        });
        // Delay navigation to ensure toast renders
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        console.log('Toast triggered: Invalid credentials');
        toast.error('Invalid email or password.', {
          position: "top-right",
          autoClose: 3000,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.log('Toast triggered: Login error', error);
      toast.error('An error occurred during login.', {
        position: "top-right",
        autoClose: 3000,
        theme: 'dark',
      });
    }
  };

  const testToast = () => {
    console.log('Toast triggered: Test toast');
    toast.info('This is a test toast!', {
      position: "top-right",
      autoClose: 3000,
      theme: 'dark',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
            <Laptop2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Etrack
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Property Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 p-2.5"
                placeholder="user@example.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Demo: admin@example.com / user@example.com
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 p-2.5"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Demo: admin123 / user123
            </p>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Log in
          </Button>
        </form>

        <Button
          onClick={testToast}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600"
        >
          Test Toast
        </Button>
      </div>
    </div>
  );
};