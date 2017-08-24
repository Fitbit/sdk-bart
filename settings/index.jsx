import { STATIONS } from "../common/globals.js"

console.log("Opening BART Settings page");

let autoValues = [];
for (let key in STATIONS) {
  autoValues.push( {
    "name": STATIONS[key] + " Northbound",
    "value": { code: key, direction: "n" }
  } );
  autoValues.push( {
    "name": STATIONS[key] + " Southbound",
    "value": { code: key, direction: "s" }
  } );
}

function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Bart Schedule</Text>}>
        <AdditiveList
          title="Select your favorite stations"
          settingsKey="favorite_station_setting"
          maxItems="5"
          addAction={
            <TextInput
              title="Add a Bart Station"
              label="Name"
              placeholder="Type something"
              action="Add Station"
              onAutocomplete={(value) => {
                return autoValues.filter((option) =>
                  option.name.toLowerCase().startsWith(value.toLowerCase()));
              }}
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
