// Node server for dealing with tally from ATEM and distributing it to Arduino shield
// Use output of Arduino shield as PGM when using Ursa Broadcast or Multiview.
// Only works with Arduino connected

var app = require('express')();
var http = require('http').Server(app);
var url = require('url');
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var ATEM = require('atem');


const atem = new ATEM('192.168.10.240');
atem.connect();
atem.on('connect', function() {
    console.log('atem connected');
    io.emit('chat message', 'atem connected')
});

// vars for serial connection
var serialPort = require("serialport");
// var SerialPort = require("serialport").SerialPort;

// Setting for first arduino MARIA CA1
const arduinoCamera1 = new serialPort("/dev/tty.usbmodem141301", {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}, false);
console.log("Starting up serial host 1...");

// Setting for second arduino SIMON CA7
const arduinoCamera2 = new serialPort("/dev/tty.usbmodem141101", {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}, false);
console.log("Starting up serial host 2...");

// Setting for third arduino RUDOLF CA8
const arduinoCamera3 = new serialPort("/dev/tty.usbmodem141201", {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}, false);
console.log("Starting up serial host 3...");

// Setting up the ATEM

atem.on('inputTally', function(sourceID, state) {
    if (sourceID == '1') {
        console.log('1 has ', 'tally', state.program)
        if (state.program == true) {
            arduinoCamera1.write('a');
            // arduinoCamera2.write('e');
            // arduinoCamera3.write('e');
            console.log('Arduino 1 now has PGM tally!')
        } else if (state.program == false) {
            arduinoCamera1.write('c');
            console.log('Arduino 1 now has NO tally!')
        }
    }
    if (sourceID == '7') {
        console.log('7 has ', 'tally', state.program)
        if (state.program == true) {
            arduinoCamera2.write('a');
            // arduinoCamera2.write('e');
            // arduinoCamera3.write('e');
            console.log('Arduino 2 now has PGM tally!')
        } else if (state.program == false) {
            arduinoCamera2.write('c');
            console.log('Arduino 2 now has NO tally!')
        }
    }
    if (sourceID == '8') {
        console.log('8 has ', 'tally', state.program)
        if (state.program == true) {
            arduinoCamera3.write('a');
            console.log('Arduino 3 now has PGM tally!')
        } else if (state.program == false) {
            arduinoCamera3.write('c');
            console.log('Arduino 3 now has NO tally!')
        }
    }
});