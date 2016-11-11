/*
 * Initialization and configuration code for the 'IoT LED Blink' app.
 * Designed to allow use of this sample on a variety of platforms.
 */

// keep /*jslint and /*jshint lines for proper jshinting and jslinting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */



/**
 * This module.exports() structure plus cfg = {}
 * allows us to pass in optional parms at require()
 * and return an object of properties and methods.
 *
 * Just doing a require() of the module is not enough.
 * The module must be "called()" to be initialized.
 *
 * var cfg = require('this-module-name')() ;
 * var cfg = require('this-module-name')({opt1:1,opt2:2}) ;
 *
 * example of how to use the options parameter:
 *
 * var options = {
 *     skipTest: true,         // skip the platform compatibility tests
 *     altGpio:  101           // initialize alternate GPIO port for LED
 * } ;
 * var cfg = require("./cfg-app-platform.js")(options) ;
 *
 * @function
 * @param {Object} options? - object containing module options
 * @return {Object} cfg - module's public methods and properties
 * @author Paul Fischer, Intel Corporation
 */

module.exports = function(options) {
"use strict" ;

    var cfg = {} ;              // for returning our module properties and methods
    var ver = {} ;              // reference to the version compare helper module
    var opt = {} ;              // to store module init passed parameters object

    options = options || {} ;   // force a parameters object if none was passed
    opt = options ;             // assign passed parameters to our permanent object

    if( opt.skipTest && (opt.skipTest !== true) )
        opt.skipTest = false ;

    if( opt.altGpio && !Number.isInteger(opt.altGpio) )
        opt.altGpio = false ;

    try {
        require.resolve("mraa") ;
    }
    catch(e) {
        process.exitCode = 1 ;
        console.error("Critical mraa node module is missing, try 'npm install -g mraa' to fix.", e) ;
        throw new Error("Unable to resolve mraa node module, see console for details.") ;
    }
    cfg.mraa = require("mraa") ;                    // initializes libmraa for I/O access
    ver = require("./utl/version-compare.js") ;     // simple version strings comparator



/**
 * Using the mraa library, detect which platform we are running on
 * and make appropriate adjustments to our gpio configuration calls.
 *
 * Check the case statements to find out which header pin is being
 * initialized for use by this app. Specifically, look for the
 * `cfg.led = new ...` lines.
 *
 * If we do not recognize the platform, issue error and exit the app.
 *
 * @function
 * @return {Boolean} true if supported platform detected (and initialized)
 * @author Paul Fischer, Intel Corporation
 */

    cfg.led = {} ;                                      // to return mraa LED I/O object

    cfg.init = function() {

        var gpio = opt.altGpio || 0 ;                   // set to zero if none provided by altGpio
        var chkPlatform = true ;                        // start out hopeful!
        switch( cfg.mraa.getPlatformType() ) {          // which board are we running on?

            case cfg.mraa.INTEL_GALILEO_GEN1:           // Gallileo Gen 1
                gpio = opt.altGpio ? gpio : 3 ;         // use alternate pin?
                cfg.led = new cfg.mraa.Gpio(gpio) ;     // initialize LED I/O pin
                break ;

            case cfg.mraa.INTEL_GALILEO_GEN2:           // Gallileo Gen 2
            case cfg.mraa.INTEL_EDISON_FAB_C:           // Edison
                gpio = opt.altGpio ? gpio : 13 ;        // use alternate pin?
                cfg.led = new cfg.mraa.Gpio(gpio) ;     // initialize LED I/O pin
                break ;

            case cfg.mraa.INTEL_GT_TUCHUCK:             // Joule (aka Grosse Tete)
                gpio = opt.altGpio ? gpio : 100 ;       // use alternate pin?
                cfg.led = new cfg.mraa.Gpio(gpio) ;     // initialize LED I/O pin
                break ;                                 // gpio 100, 101, 102 or 103 will work

            default:
                if( opt.skipTest && opt.altGpio ) {
                    cfg.led = new cfg.mraa.Gpio(gpio) ; // force run on unknown platform with alt pin
                }
                else {
                    console.error("Unknown libmraa platform: " + cfg.mraa.getPlatformType() + " -> " + cfg.mraa.getPlatformName()) ;
                    chkPlatform = false ;               // did not recognize the platform
                }
        }
        if( chkPlatform )
            cfg.led.dir(cfg.mraa.DIR_OUT) ;             // configure the LED gpio as an output

        return chkPlatform ;
    } ;



/**
 * Confirms that we have a version of libmraa and Node.js that works
 * with this version of the app and on this board.
 *
 * If we detect incompatible versions, return false.
 *
 * @function
 * @return {Boolean} true if "all systems go"
 * @author Paul Fischer, Intel Corporation
 */

    cfg.test = function() {

        if( opt.skipTest )     // if bypass version testing
            return true ;                               // pretend platform tests passed

        var checkNode = false ;
        var checkMraa = false ;
        switch( cfg.mraa.getPlatformType() ) {          // which board are we running on?

            case cfg.mraa.INTEL_GALILEO_GEN1:           // Gallileo Gen 1
            case cfg.mraa.INTEL_GALILEO_GEN2:           // Gallileo Gen 2
            case cfg.mraa.INTEL_EDISON_FAB_C:           // Edison
                checkNode = checkNodeVersion("4.0") ;
                checkMraa = checkMraaVersion("1.0.0") ;
                break ;

            case cfg.mraa.INTEL_GT_TUCHUCK:             // Joule (aka Grosse Tete)
                checkNode = checkNodeVersion("4.0") ;
                checkMraa = checkMraaVersion("1.3.0") ;
                break ;

            default:
                console.error("Unknown libmraa platform: " + cfg.mraa.getPlatformType() + " -> " + cfg.mraa.getPlatformName()) ;
        }
        return (checkMraa && checkNode) ;
    } ;

    // "private" helper functions used by cfg.test() function, above
    // defined outside of cfg.test() to minimize chance of memory leaks

    function checkNodeVersion(minNodeVersion) {
        if( ver.versionCompare(process.versions.node, minNodeVersion) < 0 ) {
            console.error("Node.js version is too old, upgrade your board's Node.js.") ;
            console.error("Node.js version: " + process.versions.node) ;
            return false ;
        }
        else
            return true ;
    }

    function checkMraaVersion(minMraaVersion) {
        if( ver.versionCompare(cfg.mraa.getVersion(), "0") === false) {
            console.error("Bad libmraa version string: " + cfg.mraa.getVersion()) ;
            return false ;
        }

        if( ver.versionCompare(cfg.mraa.getVersion(), minMraaVersion) < 0 ) {
            console.error("libmraa version is too old, upgrade your board's mraa node module.") ;
            console.error("libmraa version: " + cfg.mraa.getVersion()) ;
            return false ;
        }
        else
            return true ;
    }



/**
 * Using standard node modules, identify platform details.
 * Such as OS, processor, etc.
 *
 * For now it just prints info to the console...
 *
 * @function
 * @return {Void}
 * @author Paul Fischer, Intel Corporation
 */

    cfg.identify = function() {

        if( opt.altGpio )
            console.log("altGpio: " + opt.altGpio) ;
        if( opt.skipTest )
            console.log("skipTest: " + opt.skipTest) ;

        console.log("node version: " + process.versions.node) ;
        console.log("mraa version: " + cfg.mraa.getVersion()) ;
        console.log("mraa platform type: " + cfg.mraa.getPlatformType()) ;
        console.log("mraa platform name: " + cfg.mraa.getPlatformName()) ;

        var os = require('os') ;
        console.log("os hostname: " + os.hostname()) ;
        console.log("os platform: " + os.platform()) ;
        console.log("os release: " + os.release()) ;
        console.log("os type: " + os.type()) ;
        console.log("os architecture: " + os.arch()) ;
//        console.log("os.cpus: ", os.cpus()) ;

//        var fs = require('fs') ;
//        var fileData = function(err, data) {
//            if( err )
//                throw new Error("Something bad happened: " + err) ;
//            else
//                console.log(JSON.stringify(data)) ;
//        } ;
//        fs.readFile('/etc/os-release', fileData) ;
    } ;



/**
 * This is the actual module object that we want, but
 * you will only get it if you call the module.exports
 * function, per the instructions at the top of this module!
 */
    return cfg ;

} ;
