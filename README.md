Intel® XDK IoT Node.js* Onboard LED Blink App
=============================================
See [LICENSE.md](LICENSE.md) for license terms and conditions.

This sample application is distributed as part of the
[Intel® XDK](http://xdk.intel.com). It can also be downloaded
or cloned directly from its git repo on the
[public Intel XDK GitHub\* site](https://github.com/gomobile).

For help getting started developing applications with the
Intel XDK, please start with
[the Intel XDK documentation](https://software.intel.com/en-us/xdk/docs).

App Overview
------------
A simple Node.js application that blinks the onboard LED (a GPIO output),
on select Intel IoT development boards, and displays the result of that write
on the console log.

The app initializes a single pin to digital output mode, so it can be written;
writes that digital output at a regular basis; and prints the result of each
write to the console. The specific pin that is written is configured in
`cfg-app-platform.js` and can be identified by looking for lines similar to the
following line of code, in the `cfg.init` method:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    io = opt.altPin ? io : 100 ;            // use alternate pin?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the example shown above, LED "pin 100" will be used to flash the LED.

**IMPORTANT:** the LED pin that is configured by the sample is a function of
the detected board. You **must** inspect the code to determine which LED pin
is being configured for use on your board!!

If you are using a NUC (aka "gateway") with an attached Arduino 101 board (aka
"firmata" configuration), the I/O pin is identified by adding 512 to the
respective I/O pin number, as it would be identified on the Arduino 101
device. See the comments in the `cfg-app-platform.js` module for details.

Some boards have multiple LEDs that can be written to ("flashed" or
"blinked"). The `cfg-app-platform.js` module has been designed so you can
override the pin that is used, by passing it an alternate pin during the init
call (see the module documentation). Or, you can simply modify the code to
change the default value.

Important App Files
-------------------
* main.js
* package.json

Important Project Files
-----------------------
* README.md
* LICENSE.md
* \<project-name\>.xdk

Tested IoT Node.js Platforms
----------------------------
* [Intel® Galileo Board for Arduino](http://intel.com/galileo)
* [Intel® Edison Board for Ardunio](http://intel.com/edison)
* [Intel® Joule™ 570x Developer Kit](http://intel.com/joule)
* [Intel® NUC DE3815](http://www.intel.com/nucsupport) + [Arduino 101](http://intel.com/arduino)

This sample can run on other IoT [Node.js](http://nodejs.org) development
platforms, that include the appropriate sensor hardware, but may require
changes to the I/O initialization and configuration code in order to work on
those other platforms.
