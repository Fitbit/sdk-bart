export function BartAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    // Default key for open public access.
    this.apiKey = "MW9S-E7SL-26DU-VV8V";
  }
};

BartAPI.prototype.realTimeDepartures = function(origin, direction) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = "https://api.bart.gov/api/etd.aspx?json=y";
    url += "&key=" + self.apiKey;
    url += "&cmd=etd";
    url += "&orig=" + origin;
    if (direction !== undefined) {
      url += "&dir=" + direction;
    }
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));

      let data = json["root"]["station"][0];
      let departures = [];

      data["etd"].forEach( (destination) => {
        destination["estimate"].forEach( (train) => {
          let d = {
            "to": destination["abbreviation"],
            "minutes": Number.parseInt(train["minutes"]),
            "platform": train["platform"],
            "bike": (train["bikeflag"] === "1" ? true : false)
          };
          if (!Number.isInteger(d["minutes"])) {
            d["minutes"] = 0;
          }
          departures.push(d);
        });
      });

      // Sort departures
      departures.sort( (a,b) => { return (a["minutes"] - b["minutes"]) } );

      resolve(departures);
    }).catch(function (error) {
      reject(error);
    });
  });
}
