import 'regenerator-runtime/runtime';
import { Readable } from 'stream';
import VescProtocolParser from './vescProtocolParser';
import PacketTypes from './packetType';

describe('The packetType', () => {
  it('should be equal to 0 for COMM_FW_VERSION', () => {
    expect(PacketTypes.COMM_FW_VERSION).toBe(0);
  });
});

describe('The VescProtocolParser', () => {
  it('should parse a COMM_FW_VERSION response', (done) => {
    const payload = Buffer.from(new Uint8Array([2, 42, 0, 5, 2, 67, 104, 101, 97, 112, 32, 70,
      79, 67, 101, 114, 32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, 60, 0, 55, 0, 11, 71,
      51, 51, 51, 52, 53, 51, 0, 0, 0, 0, 222, 50, 3]));

    const vescProtocolParser = new VescProtocolParser();
    const reader = new Readable();

    expect.assertions(2);

    vescProtocolParser.on('data', (packet) => {
      expect(packet.type).toEqual(PacketTypes.COMM_FW_VERSION);
      expect(packet.payload.length).toEqual(41);
    });
    vescProtocolParser.on('finish', () => {
      done();
    });

    reader.pipe(vescProtocolParser);
    reader.push(payload);
    reader.push(null);
  });
});
