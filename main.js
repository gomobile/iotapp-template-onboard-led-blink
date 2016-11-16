/*
 * A simple Node.js application to blink the onboard LED.
 * Supported Intel IoT development boards are identified in the code.
 *
 * See LICENSE.md for license terms and conditions.
 *
 * https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
 */

// keep /*jslint and /*jshint lines for proper jshinting and jslinting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */

"use strict" ;


var APP_NAME = "IoT LED Blink" ;
var cfg = require("./cfg-app-platform.js")() ;          // init and config I/O resources

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n") ;   // poor man's clear console
console.log("Initializing " + APP_NAME) ;


// confirm that we have a version of libmraa and Node.js that works
// exit this app if we do not

cfg.identify() ;                // prints some interesting platform details to console

if( !cfg.test() ) {
    process.exitCode = 1 ;
    throw new Error("Call to cfg.test() failed, check console messages for details.") ;
}

if( !cfg.init() ) {
    process.exitCode = 1 ;
    throw new Error("Call to cfg.init() failed, check console messages for details.") ;
}


// configure (initialize) our I/O pins for usage (gives us an I/O object)
// configuration is based on parameters provided by the call to cfg.init()

cfg.io = new cfg.mraa.Gpio(cfg.ioPin,cfg.ioOwner,cfg.ioRaw) ;
cfg.io.dir(cfg.mraa.DIR_OUT) ;                  // configure the LED gpio as an output

console.log("Using LED pin number: " + cfg.ioPin) ;


// now we are going to flash the LED by toggling it at a periodic interval

var ledState ;
var periodicActivity = function() {
    ledState = cfg.io.read() ;                  // get the current state of the LED pin
    cfg.io.write(ledState?0:1) ;                // if the pin is currently 1 write a '0' (low) else write a '1' (high)
    process.stdout.write(ledState?'0':'1') ;    // and write an unending stream of toggling 1/0's to the console
} ;
var intervalID = setInterval(periodicActivity, 1000) ;  // start the periodic toggle


// type process.exit(0) in debug console to see
// the following message be emitted to the debug console

process.on("exit", function(code) {
    clearInterval(intervalID) ;
    console.log("\nExiting " + APP_NAME + ", with code:", code) ;
}) ;
