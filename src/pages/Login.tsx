import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilmIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!registerEmail || !registerPassword) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const success = await register(registerEmail, registerPassword, registerName);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-text flex flex-col">
      <ParticleBackground />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-primary-dark/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <FilmIcon size={48} className="text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-highlight">Movie Sentiment Analysis</h1>
              <p className="text-text/80 mt-2">Discover insights from movie reviews</p>
            </div>
            
            <div className="flex mb-6 bg-black/20 rounded-lg p-1">
              <button 
                className={`flex-1 py-2 rounded-md transition-all ${activeTab === 'login' ? 'bg-accent text-white' : 'text-text/70 hover:text-text'}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button 
                className={`flex-1 py-2 rounded-md transition-all ${activeTab === 'register' ? 'bg-accent text-white' : 'text-text/70 hover:text-text'}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            
            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="login-email" className="block text-sm font-medium text-text/90 mb-1">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="login-password" className="block text-sm font-medium text-text/90 mb-1">Password</label>
                  <input
                    type="password"
                    id="login-password"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="register-name" className="block text-sm font-medium text-text/90 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    id="register-name"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text"
                    placeholder="Your Name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="register-email" className="block text-sm font-medium text-text/90 mb-1">Email</label>
                  <input
                    type="email"
                    id="register-email"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="register-password" className="block text-sm font-medium text-text/90 mb-1">Password</label>
                  <input
                    type="password"
                    id="register-password"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="text-center p-4 text-text/60 text-sm">
        <p>&copy; 2025 Movie Sentiment Analysis Project</p>
      </div>
    </div>
  );
};

export default Login;