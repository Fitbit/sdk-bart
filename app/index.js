/*
 * Entry point for the watch app
 */

import * as messaging from "messaging";
import { BartUI } from "./ui.js";

console.log("BART App Started");
var ui = new BartUI();

ui.updateUI("disconnected");

/*
var fakeData = [
  {"to":"RICH","minutes":9,"platform":"0","bike":true}
];
ui.updateUI("loaded", fakeData);
*/

// Helpful to check whether we are connected or not.
setInterval(function() {
  console.log("BART App running - Connectivity status=" + messaging.peerSocket.readyState +
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);


// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  ui.updateUI("loading");
  console.log("Socket opened");
  messaging.peerSocket.send("Hi!");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Received message!");
  ui.updateUI("loaded", evt.data);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
  ui.updateUI("error");
}
