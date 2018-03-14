import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { BartAPI } from "./bart.js"
import { TRAIN_COUNT, FAVORITE_STATION_SETTING } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  sendBartSchedule();
}

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
 
  if (!station || typeof(station) !== "object" || station.length < 1 || typeof(station[0]) !== "object") {
    station = { code: "embr", direction: "s" };
  }
  else {
    station = station[0].value;
  }
  let bartApi = new BartAPI();
  bartApi.realTimeDepartures(station.code, station.direction).then(function(departures) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Limit results to the number of tiles available in firmware
      departures.splice(TRAIN_COUNT, departures.length);
      messaging.peerSocket.send(departures);
    }
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });
}
