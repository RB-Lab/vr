import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
import startVR from './vr';
import landscape from './objects/landscape';
import line from './objects/line';
import box from './objects/box';

const vr = startVR();
vr.addToScene(landscape(vr.anisotropy));
vr.addToScene(line([10, 10, 0], [10, 12, 0]));
vr.addToScene(line([10, 11, -1], [10, 11, 1]));
vr.addToScene(box());

const socket = io(`${window.location.protocol}//${window.location.hostname}:3050`);

const p2p = new P2P(socket);
p2p.usePeerConnection = true;

p2p.on('peer-msg', d => console.log('p2p!', d));

window.p2p = p2p;
