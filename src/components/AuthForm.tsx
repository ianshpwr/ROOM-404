
import { useState } from 'react';
import { Shield, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface AuthFormProps {
  isRegister: boolean;
  setIsRegister: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleAuth: () => void;
}

const AuthForm = ({
  isRegister,
  setIsRegister,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md p-8 mx-auto glass-panel animate-fadeIn">
      <div className="flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold tracking-wider">
          {isRegister ? "CREATE ACCOUNT" : "SECURE ACCESS"}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            IDENTIFIER
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            PASSKEY
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleAuth} 
          className="w-full anon-button"
        >
          {isRegister ? (
            <>
              <UserPlus className="h-5 w-5" />
              <span className="ml-2">REGISTER</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span className="ml-2">LOGIN</span>
            </>
          )}
        </button>
        
        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-gray-400 hover:text-white"
            style={{ transition: 'color 0.2s' }}
          >
            {isRegister 
              ? "Already have access? Login" 
              : "Need access? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
