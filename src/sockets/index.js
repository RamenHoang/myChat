import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
/**
 * 
 * @param {*} io  from socket.io lib
 */
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
}

module.exports = initSockets;
