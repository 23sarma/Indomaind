import React, { useState } from 'react';
import { AuthView } from '@/types';
import IndomindLogo from '@/components/ui/IndomindLogo';

interface RegisterProps {
  onRegister: () => void;
  setView: (view: AuthView) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    // Mock OTP sending
    console.log('Sending OTP to', email);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    console.log(`%cIndomind OTP: ${newOtp}`, 'color: cyan; font-size: 16px; font-weight: bold;');
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) { // Mock OTP
      setError('');
      console.log('OTP verified, registering user.');
      onRegister();
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1a3a]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-cyan-400/20">
      <div className="flex flex-col items-center mb-6">
        <IndomindLogo className="w-16 h-16" />
        <h1 className="text-3xl font-bold text-white mt-4">Create an Account</h1>
        <p className="text-gray-400">Join Indomind and explore AI</p>
      </div>
      
      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300">Email / Mobile Number</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white" required />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
            Get OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-6">
           <p className="text-center text-gray-300">An OTP has been sent. Please check your browser's developer console.</p>
          <div>
            <label className="text-sm font-medium text-gray-300">Enter OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white" required />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105">
            Verify & Register
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{' '}
          <button onClick={() => setView(AuthView.LOGIN)} className="font-semibold text-cyan-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;