'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import VideoList from '@/components/VideoList';
import { Profile } from '@/models/profile';
import PushNotificationComponent from '@/components/PushNotificationComponent';

const Home: React.FC = () => {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(profileData.data);
  }, []);

  return (
    <div>
      <Header profile={profile} setProfile={setProfile} />
      <VideoList profile={profile} />
      <ToastContainer />
      <PushNotificationComponent />
    </div>
  );
};

export default Home;
