const LOGITECH_LED_SDK_URL = "https://gaming.logitech.com/sdk/LED_8.87.zip";

var fs = require("fs");
var path = require("path");
var EOL = require("os").EOL;
var unzip = require("unzipper");
var request = require("request");
var progressBar = require("progress-bar").create(
  process.stdout,
  (process.stdout.columns || 70) - 20
);
progressBar.format = "$bar; $percentage;% finished.";

// only download SDK if not already done
if (!fs.existsSync(path.join(__dirname, "LED"))) {
  // download and unzip SDK into the LED folder...
  console.log("Download and unzip Logitech LED SDK...");

  // also show a fancy progress bar if stdout is a terminal
  request(LOGITECH_LED_SDK_URL)
    .on("error", function(err) {
      console.log("error downloading Logitech LED SDK:", err.message, EOL);
      process.exit(1);
    })
    .on("end", function() {
      console.log("finished successfully." + EOL);
    })
    .pipe(unzip.Extract({ path: __dirname }));
}
