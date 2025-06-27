import React, { useState, useEffect } from "react";
import { Wrench, Mail, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Background icon grid and particle animation
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.className = "absolute inset-0 z-0";
    document.querySelector(".login-container")?.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 4,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      type: Math.floor(Math.random() * 3), // 0: CheckCircle, 1: AlertTriangle, 2: Wrench
    }));

    let mouseX = 0;
    let mouseY = 0;

    const drawIcon = (x, y, size, type) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 24, size / 24);
      ctx.fillStyle =
        type === 0
          ? "rgba(20, 184, 166, 0.8)"
          : type === 1
          ? "rgba(255, 107, 107, 0.8)"
          : "rgba(79, 70, 229, 0.8)";
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      if (type === 0) {
        // CheckCircle
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(10, 16);
        ctx.lineTo(18, 8);
        ctx.stroke();
      } else if (type === 1) {
        // AlertTriangle
        ctx.beginPath();
        ctx.moveTo(12, 4);
        ctx.lineTo(20, 20);
        ctx.lineTo(4, 20);
        ctx.closePath();
        ctx.fill();
      } else {
        // Wrench
        ctx.beginPath();
        ctx.moveTo(12, 4);
        ctx.lineTo(8, 8);
        ctx.lineTo(12, 12);
        ctx.lineTo(16, 8);
        ctx.lineTo(12, 20);
        ctx.lineTo(8, 16);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += dx * 0.002;
          p.vy += dy * 0.002;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${1 - dist / 80})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        drawIcon(p.x, p.y, p.size, p.type);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    };
  }, []);

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      console.log('Attempting login with:', { email }); // Debug log
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative overflow-hidden login-container">
      {/* Animated Gradient Background with Icon Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-teal-100 to-purple-200 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900 animate-gradient-bg">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 gap-4 opacity-15">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center animate-float"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {i % 3 === 0 ? (
                <CheckCircle className="h-5 w-5 text-teal-500 animate-pulse" />
              ) : i % 3 === 1 ? (
                <AlertTriangle className="h-5 w-5 text-red-500 animate-rotate-subtle" />
              ) : (
                <Wrench className="h-5 w-5 text-indigo-500 animate-rotate-subtle" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        {/* Floating Status Badges */}
        <div className="absolute top-12 left-12 animate-orbit hidden lg:block">
          <div className="p-2 bg-teal-100/50 dark:bg-teal-900/50 rounded-full backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute bottom-12 right-12 animate-orbit-reverse hidden lg:block">
          <div className="p-2 bg-red-100/50 dark:bg-red-900/50 rounded-full backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Glassmorphism Form */}
        <div className="w-full max-w-md bg-white/15 dark:bg-gray-800/15 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gradient animate-border-pulse p-8 animate-slide-right">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-200 to-teal-200 dark:from-indigo-900 dark:to-teal-900 backdrop-blur-sm mb-4 transform hover:scale-110 transition-transform duration-300">
              <Wrench className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-rotate-subtle" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sign in to ETrack
            </h2>
          </div>

          {error && (
            <div className="bg-red-100/20 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4 text-sm backdrop-blur-sm animate-shake border border-red-500/30">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="animate-fade-in-delayed">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 peer-focus:animate-vibrate" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 block w-full rounded-md border border-gray-300/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(79,70,229,0.5)] p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg peer"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div className="animate-fade-in-delayed">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 peer-focus:animate-vibrate" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 block w-full rounded-md border border-gray-300/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(79,70,229,0.5)] p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg peer"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-semibold rounded-md py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              <span className="relative z-10">Sign in</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};