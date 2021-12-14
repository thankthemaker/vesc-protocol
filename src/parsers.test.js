import VescBuffer from './vescBuffer';
import {
  bufferToArray,
  getFWVersion,
  getValues,
  getDecodedPPM,
} from './parsers';

describe('The parser', () => {
  it('should return an array', () => {
    const payload = Buffer.from('020100000003');
    expect(bufferToArray(payload))
      .toStrictEqual(['30', '32', '30', '31', '30', '30', '30', '30', '30', '30', '30', '33']);
  });

  it('should return the Firmware version', () => {
    const payload = Buffer.from(new Uint8Array([5, 2, 67, 104, 101, 97, 112, 32, 70,
      79, 67, 101, 114, 32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, 60, 0, 55, 0, 11, 71,
      51, 51, 51, 52, 53, 51, 0, 0, 0, 0, 0, 0, 3]));
    const buffer = new VescBuffer(payload);
    return getFWVersion(buffer).then((data) => {
      expect(data.version.major).toBe(5);
      expect(data.version.minor).toBe(2);
      expect(data.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
    });
  });

  it('should return the values', () => {
    const payload = Buffer.from(new Uint8Array([5, 2, 67, 104, 101, 97, 112,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 70, 79, 67, 101,
      114, 32, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      32, 118, 48, 46, 57, 43, 32, 118, 49, 0, 60, 0, 55, 0, 11, 71,
      51, 51, 51, 52, 53, 51, 0, 0, 0, 0, 0, 0, 3]));
    const buffer = new VescBuffer(payload);
    return getValues(buffer).then((data) => {
      expect(data.temp.mosfet).toBe(128.2);
    });
  });

  it('should return the decoded PPM', () => {
    const payload = Buffer.from(new Uint8Array([5, 2, 67, 104, 101, 97, 112, 32, 70,
      79, 67, 101, 114, 32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, 60, 0, 55, 0, 11, 71,
      51, 51, 51, 52, 53, 51, 0, 0, 0, 0, 0, 0, 3]));
    const buffer = new VescBuffer(payload);
    return getDecodedPPM(buffer).then((data) => {
      expect(data.decodedPPM).toBe(84.034408);
    });
  });
});
