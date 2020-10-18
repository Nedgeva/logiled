const LOGITECH_LED_SDK_URL = "https://www.logitechg.com/sdk/LED_SDK_9.00.zip";

const fs = require("fs/promises");
const axios = require("axios");
const ProgressBar = require("progress");
const unzip = require("unzip-stream");

async function downloadSDK() {
  try {
    const stats = await fs.stat("./LED");
    if (stats.isDirectory())
      return console.log("Download aborted, resources already in LED folder");
  } catch (error) {}

  console.log("Connecting …");

  const { data, headers } = await axios({
    url: LOGITECH_LED_SDK_URL,
    method: "GET",
    responseType: "stream",
  });

  const totalLength = headers["content-length"];

  console.log("Starting download");

  const progressBar = new ProgressBar("-> downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  data
    .on("data", (chunk) => progressBar.tick(chunk.length))
    .on("error", console.error);

  data.pipe(unzip.Extract({ path: __dirname }));
}

downloadSDK();
