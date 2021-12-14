/**
 * @param {Buffer} buffer
 */
export function bufferToArray(buffer) {
  return [...buffer].map((byte) => byte.toString(16)).map((byte) => {
    if (byte.length < 2) {
      return `0${byte}`;
    }

    return byte;
  });
}

/**
 * @param {VescBuffer} payload
 */
export function getFWVersion(payload) {
  const response = {
    version: {
      major: -1,
      minor: -1,
    },
    hardware: 'UNKNOWN',
    uuid: null,
  };

  if (payload.size() >= 2) {
    response.version.major = payload.readUInt8();
    response.version.minor = payload.readUInt8();
    response.hardware = payload.readString();
    response.uuid = bufferToArray(payload.slice(12));
  }

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getValues(payload) {
  const response = {
    temp: {
      mosfet: 0.0,
      motor: 0.0,
    },
    current: {
      motor: 0.0,
      battery: 0.0,
    },
    id: 0.0,
    iq: 0.0,
    dutyNow: 0.0,
    rpm: 0.0,
    voltage: 0.0,
    ampHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    wattHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    tachometer: {
      value: 0.0,
      abs: 0.0,
    },
    faultCode: 0,
  };

  response.temp.mosfet = payload.readDouble16(1e1);
  response.temp.motor = payload.readDouble16(1e1);
  response.current.motor = payload.readDouble32(1e2);
  response.current.battery = payload.readDouble32(1e2);
  response.id = payload.readDouble32(1e2);
  response.iq = payload.readDouble32(1e2);
  response.dutyNow = payload.readDouble16(1e3);
  response.rpm = payload.readDouble32(1e0);
  response.voltage = payload.readDouble16(1e1);
  response.ampHours.consumed = payload.readDouble32(1e4);
  response.ampHours.charged = payload.readDouble32(1e4);
  response.wattHours.consumed = payload.readDouble32(1e4);
  response.wattHours.charged = payload.readDouble32(1e4);
  response.tachometer.value = payload.readInt32();
  response.tachometer.abs = payload.readInt32();
  response.faultCode = payload.readInt8();

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getDecodedPPM(payload) {
  const response = {
    decodedPPM: 0.0,
    ppmLastLen: 0.0,
  };

  response.decodedPPM = payload.readDouble32(1e6);
  response.ppmLastLen = payload.readDouble32(1e6);

  return Promise.resolve(response);
}
