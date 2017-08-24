import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

import { BartAPI } from "./bart.js"
import { TRAIN_COUNT, FAVORITE_STATION_SETTING } from "../common/globals.js";

console.log("Companion starting! LaunchReasons: " + JSON.stringify(me.launchReasons));

settingsStorage.onchange = function(evt) {
  console.log("Settings have changed! " + JSON.stringify(evt));
  sendBartSchedule();
}

// Helpful to check whether we are connected or not.
setInterval(function() {
  console.log("BART App (" + me.buildId + ") running - Connectivity status=" + messaging.peerSocket.readyState + 
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendBartSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

function sendBartSchedule() {
  let station = settingsStorage.getItem(FAVORITE_STATION_SETTING);
  if (station) {
    try {
      station = JSON.parse(station);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  console.log("Setting value: " + JSON.stringify(station));
  
  if (!station || typeof(station) !== "object" || station.length < 1 || typeof(station[0]) !== "object") {
    station = { code: "embr", direction: "s" };
    console.log("No setting found - using default value of Embarcadero");
  }
  else {
    station = station[0].value;
  }
  var bartApi = new BartAPI();
  bartApi.realTimeDepartures(station.code, station.direction).then(function(departures) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Limit results to the number of tiles available in firmware
      departures.splice(TRAIN_COUNT, departures.length);
      console.log("Sending departures: " + JSON.stringify(departures));
      messaging.peerSocket.send(departures);
    }
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });
}
