
var fs = require('fs');
var unzip = require('unzip');
var fstream = require('fstream');
var request = require('request');
var progress = require('request-progress');
var progressBar = require('progress-bar').create(process.stdout, (process.stdout.columns || 70) - 20);
progressBar.format = '$bar; $percentage;% finished.';

var writeStream = new fstream.Writer(__dirname);

if (!fs.existsSync(__dirname+'/LED')) {

    console.log('Download and unzip Logitech LED SDK...');
    progress(request('https://gaming.logitech.com/sdk/LED_8.87.zip'), {
        throttle: 250
    })
    .on('progress', function (state) {
        if (process.stdout.isTTY) {
            progressBar.update(state.percent);
        }
    })
    .on('error', function (err) {
        if (process.stdout.isTTY) {
            progressBar.clear();
        }
        console.log('error downloading Logitech LED SDK:', err.message, '\n');
        process.exit(1);
    })
    .on('end', function (state) {
        if (process.stdout.isTTY) {
            progressBar.clear();
        }
        console.log('finished successfully.\n');
    })
    .pipe(unzip.Parse())
    .pipe(writeStream);
}