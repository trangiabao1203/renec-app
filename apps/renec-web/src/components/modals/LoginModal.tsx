import { AuthRepository } from '@/repositories/auth.repository';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface LoginPopupProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const authRepository = new AuthRepository();

const LoginModal: React.FC<LoginPopupProps> = ({ open, onClose, onSwitchToRegister }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    authRepository.login(email, password).then(res => {
      if (res) {
        onClose();
      }
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-auto z-50 ${open ? 'visible' : 'invisible'}`}
    >
      <div className="fixed inset-0 backdrop-filter backdrop-blur-lg bg-opacity-50" />
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 mt-4 mr-4"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
            />
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Login
            </button>
          </div>
        </form>
        <p className="text-white text-center mt-4">
          Not registered?{' '}
          <a href="#" className="text-blue-500 underline" onClick={onSwitchToRegister}>
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
