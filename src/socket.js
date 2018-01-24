import * as io from 'socket.io-client';
import axios from './axios';
import { store } from './start'
import { allOnlineUsers, userJoined, disconnect } from '/.actions';

let socket;

export function getSocket() {
    if (!socket) {
        socket = io.connect();

        socket.on('connect', function() {
            store.dispatch(allOnlineUsers(socket.id));
        });

        socket.on('userJoined', function(joined) {
            store.dispatch(userJoined(joined));
        });

        socket.on('userLeft', function(left) {
            store.dispatch(disconnect(left));
        });

    }
    return socket;
}
