import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:9010', {
      transports: ['websocket'],
    });
  }

  return socket;
};