// modification of https://gist.github.com/alexey-bass/1115557
// Modifications, Copyright (c) 2016, Paul Fischer, Intel Corporation
// converted so it can be "required" in node.js app
// ignore leading 'v' character in version string (mraa adds this)
// cleanup minor jshint/jslint errors
// add use strict control string

// keep /*jslint and /*jshint lines for proper jshinting and jslinting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */


/**
 * Simply compares two string version values.
 *
 * Example:
 * versionCompare('1.1', '1.2') => -1
 * versionCompare('1.1', '1.1') =>  0
 * versionCompare('1.2', '1.1') =>  1
 * versionCompare('2.23.3', '2.22.3') => 1
 *
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @function
 * @param {String} left  Version #1
 * @param {String} right Version #2
 * @return {Integer|Boolean}
 * @author Alexey Bass (albass)
 * @since 2011-07-14
 */

exports.versionCompare = function(left, right) {
"use strict" ;

    if (typeof left + typeof right != 'stringstring')
        return false;

    var a = left.split('.') ;
    var b = right.split('.') ;
    var i = 0, len = Math.max(a.length, b.length) ;

    if( a[0].substring(0,1) === 'v' )
        a[0] = a[0].substring(1) ;
    if( b[0].substring(0,1) === 'v' )
        b[0] = b[0].substring(1) ;

    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }

    return 0;
} ;
