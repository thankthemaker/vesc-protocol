# VESC protocol

![main workflow](https://github.com/thankthemaker/vesc-protocol/actions/workflows/main.yml/badge.svg)

This is a Javascript / Typescript implementation of the VESC protocol based on RXJS.

## Credits

It is based on the work of Mark48Evo https://github.com/Mark48Evo but doesn't use NodeJS stream API. Instead it uses RXJS which makes it easy useable in Angular or other web frontend technologies.

Thanks a lot for his great work to Mark48Evo.

## Install

For Angular >=12 simply install the library via Node package manager

``` bash
npm i @thankthemaker/vesc-protocol@latest
````

and make sure to add support for `Buffer` to your `polyfill.ts` by adding these lines.

``` bash
(window as any).global = window;
(window as any).global.Buffer = require('buffer').Buffer;
(window as any).process = {};
```

## Usage

The most important parts of this library are the `VescMessageHandler` and the `VescMessageParser` which together are responsible to parse and interpret incoming VESC-messages from a Buffer.

### VescMessageParser

The `VescMessageParser` class is responsible for distinguishing the types of VESC-messages returned from the different VESC-commands, e.g. COMM_FW_VERSION.

Yuo simply instantiate a new `VescMessageParser` and subscribe to it's internal RXJS-Subject like this.

```javascript
const vescMessageParser = new VescMessageParser();
vescMessageParser.subscribe((message) => {
    // your code, e.g
    console.log(`message.type: ${message.type}`);
    console.log(`message.payload: ${message.payload}`);
}
```

The `message` always contains a type and a payload.

### VescMessageHandler

This class takes care of the general message handling. It distingushes the different VESC package types (short vs long), checks for the size and also checks the message integrity by comparing the CRC16.

To create a `VescMessageHandler` simply instantiate a new instance and pass in a `VescMessageParser` object.

```javascript
const vescMessageHandler = new VescMessageHandler(vescMessageParser);
```

To pass a VESC message to the `VescMessageHandler` simply call the queueMessage method with a Buffer object, assuming a Uint8Array from the VESc:

``` javascript
// assuming payload is a Uint8Array
vescMessageHandler.queueMessage(Buffer.from(payload));
```

## Code-Example

Here's a simple standalone example for the usage of this library.

```javascript
const commFwVersionResponse = Buffer.from(new Uint8Array([
  2, // short package
  42, // 42 byte
  0, // COMM_FW_VERSION
  5, // major
  2, // minor
  67, 104, 101, 97, 112, 32, 70, 79, 67, 101, 114, // hardware
  32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, // hardware continued
  60, 0, 55, 0, 11, 71, 51, 51, 51, 52, 53, 51, // uuid
  0, 0,
  0, 0,
  222, 50, // CRC
  3, // package end
]));

const vescMessageParser = new VescMessageParser();
const vescMessageHandler = new VescMessageHandler(vescMessageParser);
vescMessageParser.subscribe((message) => {
  console.log(`message type: ${message.type}`);
  console.log(`vesc hardware: ${message.payload.hardware}`);
});

// pass the COMM_FW_VERSION response to the handler
vescMessageHandler.queueMessage(payload5);
```

This example should print

```bash
COMM_FW_VERSION
Cheap FOCer 2 v0.9+ v1
````

to the console.
