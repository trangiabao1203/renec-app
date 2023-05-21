import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { AuthRepository } from '../../repositories/auth.repository';

interface RegisterPopupProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const authRepository = new AuthRepository();

const RegisterModal: React.FC<RegisterPopupProps> = ({ open, onClose, onSwitchToLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      email: (e.target as any).email.value,
      fullName: (e.target as any).fullName.value,
      password: (e.target as any).password.value,
      confirmedPassword: (e.target as any).confirmedPassword.value,
    };
    authRepository.register(body).then((res) => {
      if (res) {
        onClose();
      }
    }
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-auto z-50 ${open ? 'visible' : 'invisible'}`}
    >
      <div className="fixed inset-0 backdrop-filter backdrop-blur-lg bg-opacity-50" />
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 relative">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
          onClick={onClose}
          style={{ margin: '0.5rem' }}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-2 font-medium text-white">
              Full name
            </label>
            <input
              type="text"
              id="fullName"
              required
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
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmedPassword" className="block mb-2 font-medium text-white">
              Confirmed Password
            </label>
            <input
              type="password"
              id="confirmedPassword"
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
            />
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Register
            </button>
          </div>
        </form>
        <p className="text-white text-center mt-4">
          Already has an account?{' '}
          <a href="#" className="text-blue-500 underline" onClick={onSwitchToLogin}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
