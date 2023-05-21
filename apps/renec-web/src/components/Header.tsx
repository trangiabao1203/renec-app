'use client';
import React from 'react';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';
import ShareModal from './modals/ShareModal';
import { Profile } from '@/models/profile';

interface Props {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

const Header: React.FC<Props> = ({ profile, setProfile }) => {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

  const handleLoginClick = () => {
    setLoginOpen(true);
  };

  const handleClose = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setShareOpen(false);
    handleProfile();
  };

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setLoginOpen(true);
    setRegisterOpen(false);
  };

  const handleProfile = () => {
    const profileData = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(profileData.data);
  };

  const handleShareClick = () => {
    setShareOpen(true);
  };

  const handleLogoutClick = () => {
    setProfile(null);
    localStorage.setItem('token', '');
    localStorage.setItem('profile', '{}');
  };

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <img className="w-16 h-16" src="logo.png" alt="Logo" />
          <h1 className="text-white text-lg font-bold ml-2">Share Video Youtube</h1>
        </div>
        {profile ? (
        <div className="items-right">
          <div className="text-white mr-4">
            Welcome, {profile.fullName}
          </div>
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded" onClick={handleShareClick}>
            Share Video
          </button>
          <button className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded ml-4" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      ) : (
        <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded" onClick={handleLoginClick}>
          Login
        </button>
      )}
        <LoginModal open={loginOpen} onClose={handleClose} onSwitchToRegister={handleSwitchToRegister} />
        <RegisterModal open={registerOpen} onClose={handleClose} onSwitchToLogin={handleSwitchToLogin} />
        <ShareModal open={shareOpen} onClose={handleClose} />
      </div>
    </header>
  );
};

export default Header;
