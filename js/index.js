import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
import startVR from './vr';

startVR();

const socket = io(`${window.location.protocol}//${window.location.hostname}:3050`);

const p2p = new P2P(socket);
p2p.usePeerConnection = true;

p2p.on('peer-msg', d => console.log('p2p!', d));

window.p2p = p2p;
