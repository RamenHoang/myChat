import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import acceptRequestContact from './contact/acceptRequestContact';
import removeContact from './contact/removeContact';
import chatTextEmoji from './chat/chatTextEmoji';
/**
 * 
 * @param {*} io  from socket.io lib
 */
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    acceptRequestContact(io);
    removeContact(io);
    chatTextEmoji(io);
}

module.exports = initSockets;
