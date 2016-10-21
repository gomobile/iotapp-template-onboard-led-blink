/*
 * A simple Node.js application to blink the onboard LED.
 * Supported Intel IoT development boards are identified in the code.
 *
 * https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
 */


// keep these lines (below) for proper jshinting and jslinting
/*jslint node:true */
/*jshint unused:true */
// see http://www.jslint.com/help.html and http://jshint.com/docs


var APP_NAME = 'IoT LED Blink' ;                        // display name of this app
var MIN_MRAA_VERSION = '1.3.0' ;                        // minimum required MRAA version

var mraa = require('mraa');                             // we need the mraa low-level I/O library
var ver = require('./version-compare.js') ;             // for comparing semVer values

console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n') ;   // poor man's clear console function
console.log('\nEntering ' + APP_NAME) ;                 // announce our intentions! :-)

var intervalID ;                                        // object to track periodic interval function
var myOnboardLed ;                                      // to hold mraa LED I/O object
var ledState ;                                          // boolean to hold the state of the LED


// confirm that we have a version of MRAA that works
// with this version of the app, exit if we do not

if( ver.versionCompare(mraa.getVersion(), MIN_MRAA_VERSION) === false) {
    console.error('Bad MRAA version string: ' + mraa.getVersion()) ;
    process.exit(mraa.getVersion()) ;
}
if( ver.versionCompare(mraa.getVersion(), MIN_MRAA_VERSION) < 0 ) {
    console.error('MRAA version is too old, upgrade your MRAA node module.') ;
    console.error('MRAA version: ' + mraa.getVersion()) ;
    process.exit(mraa.getVersion()) ;
}


// using the mraa library, detect which platform we are running on
// and make appropriate adjustments to our gpio configuration calls
// if we do not recognize the platform, issue error and exit the app

switch( mraa.getPlatformType() ) {

    case mraa.INTEL_GALILEO_GEN1:                       // Gallileo Gen 1
        myOnboardLed = new mraa.Gpio(3, false, true) ;  // GPIO pin to drive onboard LED
        break ;

    case mraa.INTEL_GALILEO_GEN2:                       // Gallileo Gen 2
    case mraa.INTEL_EDISON_FAB_C:                       // Edison
        myOnboardLed = new mraa.Gpio(13) ;              // GPIO pin to drive onboard LED
        break ;

    case mraa.INTEL_GT_TUCHUCK:                         // Joule (aka Grosse Tete)
        myOnboardLed = new mraa.Gpio(100) ;             // GPIO pin to drive onboard LED
        break ;                                         // GPIO 100, 101, 102 or 103 will work

    default:
        console.error("Unknown MRAA platform: " + mraa.getPlatformType() + " -> " + mraa.getPlatformName()) ;
        process.exit(mraa.getPlatformType()) ;
}
myOnboardLed.dir(mraa.DIR_OUT) ;                        // set the GPIO direction to output


// now we are going to flash the LED
// by simply toggling it at a periodic interval

var periodicActivity = function() {
    var ledState = myOnboardLed.read() ;                // get the current state of the LED pin
    myOnboardLed.write(ledState?0:1) ;                  // if the pin is currently 1 write a '0' (low) else write a '1' (high)
    process.stdout.write(ledState?'0':'1') ;            // and write an unending stream of toggling 1/0's to the console
} ;
intervalID = setInterval(periodicActivity, 1000) ;      // start the periodic toggle


// type process.exit(0) in debug console to see
// the following message be emitted to the debug console

process.on('exit', function(code) {
    clearInterval(intervalID) ;
    console.log('\nExiting ' + APP_NAME + ', with code:', code) ;
}) ;
