export const MESSAGE_FW_VERSION = {
  START: Buffer.from(new Uint8Array([
    2, // short package
    42, // 42 byte
    0, // COMM_FW_VERSION
  ])),
  PACKAGE: Buffer.from(new Uint8Array([
    5, // major
    2, // minor
    67, 104, 101, 97, 112, 32, 70, 79, 67, 101, 114, // hardware
    32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, // hardware continued
    60, 0, 55, 0, 11, 71, 51, 51, 51, 52, 53, 51, // uuid
  ])),
  END: Buffer.from(new Uint8Array([
    0, 0,
    0, 0,
    222, 50, // CRC
    3, // package end
  ])),
};

export const MESSAGE_GET_VALUES = {
  PACKAGE: Buffer.from(new Uint8Array([
    2, 0, // temp.mosfet
    2, 4, // temp.motor
    0, 0, 112, 0, // current.motor
    0, 0, 43, 3, // current.battery
    0, 0, 0, 0, // id
    0, 0, 0, 0, // iq
    0, 0, // dutyCycle
    0, 0, 70, 79, // erpm
    2, 101, // voltage
    0, 32, 50, 0, // ampHours.consumed
    0, 0, 0, 0, // ampHours.charged
    0, 0, 0, 0, // wattHours.consumed
    0, 0, 0, 0, // wattHours.charged
    0, 0, 0, 32, // tachometer.value
    118, 48, 46, 57, // tachometer.abs
    3, // faultCode
  ])),
};

export const MESSAGE_GET_DECODED_PPM = {
  PACKAGE: Buffer.from(new Uint8Array([
    5, 2, 67, 104, // decodedPPM
    101, 97, 112, 32, // ppmLastLen
  ])),
};

export const MESSAGE_STATUS_1 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 0, 0, 100, // erpm
    0, 55, // current
    0, 77, // dutyCycle
  ])),
};

export const MESSAGE_STATUS_2 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 3, 0, 2, // ampHours.consumed
    0, 1, 5, 0, // ampHours.consumed
  ])),
};

export const MESSAGE_STATUS_3 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 3, 0, 2, // wattHours.consumed
    0, 1, 5, 0, // wattHours.charged
  ])),
};

export const MESSAGE_STATUS_4 = {
  PACKAGE: Buffer.from(new Uint8Array([
    1, 167, // temp.mosfet
    1, 56, // temp.motor
    0, 101, // totalCurrentIn
    0, 50, // pidPosition
  ])),
};

export const MESSAGE_STATUS_5 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 0, 0, 10, // tachometer.value
    1, 197, 0, 0, // voltage
  ])),
};

export const MESSAGE_GET_VALUES_SELECTIVE = {
  PACKAGE: Buffer.from(new Uint8Array([
    1, 167, // mosfet
    1, 56, // motor
    100, 0, // dutyCycle
    0, 0, 0, 100, // erpm
    1, 197, // voltage
    0, 1, 0, 0, // tachometer.value
    0, 2, 0, 0, // tachometer.abs
    1, // faultCode
  ])),
};

export const MESSAGE_COMM_GET_IMU_DATA = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 2, 0, 0, // pidOutput
    0, 2, 0, 0, // pitch
    0, 2, 0, 0, // roll
    0, 0, 0, 10, // loopTime
    0, 0, 0, 0, // motorCurrent
    0, 0, 0, 0, // motorPosition
    0, 0, 0, 0, // balanceState
    0, 0, // switchState
    0, 0, 0, 0, // adc1
    0, 0, 0, 0, // adc2
  ])),
};

export function generateMessage(type) {
  return Buffer.concat([
    type.START,
    type.PACKAGE,
    type.END,
  ]);
}
