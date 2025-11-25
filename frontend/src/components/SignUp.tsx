import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function SignUp({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 glass-strong rounded-2xl">
        <h1 className="text-2xl font-bold text-center text-white">Create an account</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 text-white bg-dark-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 text-white bg-dark-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
          <button type="submit" className="w-full px-4 py-2 font-bold text-dark-950 bg-neon-cyan rounded-md hover:bg-opacity-90 transition-colors">
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-900 text-gray-500">Or continue with</span>
          </div>
        </div>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md hover:bg-dark-800 transition-colors">
          <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-white">Google</span>
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-neon-cyan hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}