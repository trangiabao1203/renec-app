import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket } from '../global';

const PushNotificationComponent: React.FC = () => {
  useEffect(() => {
    const socket: Socket = initSocket();

    // Subscribe to the 'notifications' event
    socket.on('notifications', (data: any) => {
      // Handle received notifications data
      console.log('Received notification:', data);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('notifications');
    };
  }, []);

  // ...

  return <div>Push Notification Component</div>;
};

export default PushNotificationComponent;
