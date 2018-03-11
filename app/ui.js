import { TRAIN_COUNT, STATIONS } from "../common/globals.js";
import document from "document";

export function BartUI() {
  this.trainList = document.getElementById("trainList");
  this.statusText = document.getElementById("status");

  this.tiles = [];
  for (let i = 0; i < TRAIN_COUNT; i++) {
    let tile = document.getElementById(`train-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }
}

BartUI.prototype.updateUI = function(state, departures) {
  if (state === "loaded") {
    this.trainList.style.display = "inline";
    this.statusText.text = "";

    this.updateDepartureList(departures);
  }
  else {
    this.trainList.style.display = "none";

    if (state === "loading") {
      this.statusText.text = "Loading departures ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App"
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
  }
}

BartUI.prototype.updateDepartureList = function(departures) {
  for (let i = 0; i < TRAIN_COUNT; i++) {
    let tile = this.tiles[i];
    if (!tile) {
      continue;
    }

    const train = departures[i];
    if (!train) {
      tile.style.display = "none";
      continue;
    }

    tile.style.display = "inline";
    train.to = train.to.toLowerCase();
    if (train.to in STATIONS) {
      tile.getElementById("destination").text = STATIONS[train.to];
    }
    else {
      tile.getElementById("destination").text = train.to;
    }
    tile.getElementById("platform").text = train.platform;
    tile.getElementById("minutes").text = train.minutes + " minutes";
    tile.getElementById("bike").image = train.bike ? "bike.png" : "nobike.png";
  }
}
