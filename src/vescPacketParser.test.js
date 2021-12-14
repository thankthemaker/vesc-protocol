import debug from 'debug';
import VescPacketParser from './vescPacketParser';
import PacketTypes from './packetType';

describe('The packetType', () => {
  it('should be equal to 0 for COMM_FW_VERSION', () => {
    expect(PacketTypes.COMM_FW_VERSION).toBe(0);
  });
});

describe('The VescPacketParser', () => {
  it('should parse a COMM_FW_VERSION response', (done) => {
    const payload = {
      payload: Buffer.from(new Uint8Array([5, 2, 67, 104, 101, 97, 112, 32, 70,
        79, 67, 101, 114, 32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, 60, 0, 55, 0, 11, 71,
        51, 51, 51, 52, 53, 51, 0, 0, 0])),
      type: 0,
    };

    const vescPacketParser = new VescPacketParser();

    expect.assertions(4);

    vescPacketParser.on('data', (packet) => {
      expect(packet.type).toBe('COMM_FW_VERSION');
      expect(packet.payload.version.major).toBe(5);
      expect(packet.payload.version.minor).toBe(2);
      expect(packet.payload.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
      done();
    });

    vescPacketParser.write(payload);
  });

  it('should parse a COMM_GET_VALUES response', (done) => {
    const payload = {
      payload: Buffer.from(new Uint8Array([1, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
      type: 4,
    };

    const vescPacketParser = new VescPacketParser();

    expect.assertions(5);

    vescPacketParser.on('data', (packet) => {
      expect(packet.type).toBe('COMM_GET_VALUES');
      expect(packet.payload.temp.mosfet).toBe(33.6);
      expect(packet.payload.temp.motor).toBe(0);
      expect(packet.payload.current.motor).toBe(0);
      expect(packet.payload.current.battery).toBe(0);
      done();
    });

    vescPacketParser.write(payload);
  });

  it('should parse a COMM_GET_DECODED_PPM response', (done) => {
    const payload = {
      payload: Buffer.from(new Uint8Array([0, 0, 10, 0, 0, 0, 20, 0])),
      type: 31,
    };

    const vescPacketParser = new VescPacketParser();

    expect.assertions(3);

    vescPacketParser.on('data', (packet) => {
      expect(packet.type).toBe('COMM_GET_DECODED_PPM');
      expect(packet.payload.decodedPPM).toBe(0.00256);
      expect(packet.payload.ppmLastLen).toBe(0.00512);
      done();
    });

    vescPacketParser.write(payload);
  });

  it('should not return a response for unknown packet type', (done) => {
    let hasDataArrived = false;
    const payload = {
      type: 99,
    };

    const vescPacketParser = new VescPacketParser();

    expect.assertions(1);

    vescPacketParser.on('data', (data) => {
      debug('data: ', data);
      hasDataArrived = true;
    });
    vescPacketParser.on('finish', () => {
      expect(hasDataArrived).toBe(false);
      done();
    });

    vescPacketParser.write(payload);
    vescPacketParser.end();
  });
});
