/**
 * @file
 * Compares two simple semver version strings.
 *
 * @author Paul Fischer, Intel Corporation
 *
 * @copyright (c) 2016-2017, Intel Corporation
 * @license BSD-3-Clause
 * <http://www.tldrlegal.com/l/bsd3>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of Intel Corporation nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* spec jslint and jshint lines for desired JavaScript linting */
/* see http://www.jslint.com/help.html and http://jshint.com/docs */
/* jslint node:true */
/* jshint unused:true */

"use strict" ;


/**
 * This is a very simple comparator that does not implement
 * the complete semver specification! It may have issues when
 * an ASCII string is part of the comparison.
 *
 * Examples:
 *
 * versionCompare('1.1', '1.2') => -1
 * versionCompare('1.1', '1.1') =>  0
 * versionCompare('1.2', '1.1') =>  1
 * versionCompare('2.23.3', '2.22.3') => 1
 *
 * Returns:
 *
 * -1 = left is LOWER than right
 *  0 = both strings are equal
 *  1 = left is GREATER than right
 *  FALSE if at least one of the inputs is not a string.
 *
 * @function
 * @param {String} left - version string
 * @param {String} right - version string
 * @return {Integer|Boolean}
 */

exports.versionCompare = function(left, right) {
    var i, len ;
    var arr1 = [], arr2 = [] ;

    if( (typeof left + typeof right) !== "stringstring" )
        return false ;

    arr1 = left.split(/[\-\.]/) ;
    arr2 = right.split(/[\-\.]/) ;

    // ignore leading 'v' character in version string (libmraa adds this)
    if( arr1[0].substring(0,1) === 'v' )
        arr1[0] = arr1[0].substring(1) ;
    if( arr2[0].substring(0,1) === 'v' )
        arr2[0] = arr2[0].substring(1) ;

    arr1 = convertToNumber(arr1) ;
    arr2 = convertToNumber(arr2) ;

    len = Math.max(arr1.length, arr2.length) ;
    for (i=0; i<len; i ++) {

        if( typeof arr1[i] === "undefined" )
            return -1 ;
        if( typeof arr2[i] === "undefined" )
            return 1 ;

        if( arr1[i] > arr2[i] )
            return 1 ;
        if( arr1[i] < arr2[i] )
            return -1 ;
    }
    return 0 ;
} ;



/**
 * Convert version array elements into numbers.
 *
 * @function
 * @param {Array} arr - array of version string elements
 * @return {Array} - converted array
 */

function convertToNumber(arr) {
    return arr.map(function(el) {
        return (typeof el === "number") ? parseInt(el) : el ;
    }) ;
}
