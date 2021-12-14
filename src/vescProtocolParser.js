/* eslint no-bitwise: "off" */
/* eslint no-restricted-syntax: "off" */
import Debug from 'debug';
import { Transform } from 'stream';
import crc16 from './crc16';

const debug = Debug('vesc:protocol-parser');

const PACKET_HEADER = 1;
const PACKET_LENGTH = 2;
const PACKET_LENGTH_SECOND = 22;
const PACKET_PAYLOAD = 3;
const PACKET_CRC_SECOND = 33;
const PACKET_CRC = 4;

const packetTemplate = {
  packetType: 0,
  packetSize: 0,
  payloadType: 0,
  payload: null,
  crc: 0,
};

export default class VescProtocolParser extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });

    this.buffer = Buffer.alloc(0);
    this.packet = { ...packetTemplate };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.packetState = 0;
  }

  /* eslint no-underscore-dangle: ["error", { "allow": ["_transform"] }] */
  _transform(chunk, encoding, cb) {
    const data = Buffer.concat([this.buffer, chunk]);
    for (const [i, byte] of data.entries()) {
      if (this.packetStartFound) {
        switch (this.packetState) {
          case PACKET_HEADER:
            if (this.packet.packetType === 2) {
              this.packet.packetSize = byte;
              this.packetState = PACKET_LENGTH;
            } else {
              this.packet.packetSize = byte << 8;
              this.packetState = PACKET_LENGTH_SECOND;
            }
            break;

          case PACKET_LENGTH_SECOND:
            this.packet.packetSize |= byte;
            this.packetState = PACKET_LENGTH;
            break;

          case PACKET_LENGTH:
            if (this.packet.payload === null) {
              this.packet.payload = Buffer.alloc(this.packet.packetSize);
            }

            this.packet.payload[this.payloadPosition] = byte;
            this.payloadPosition += 1;

            if (this.payloadPosition >= this.packet.packetSize) {
              this.packetState = PACKET_PAYLOAD;
            }
            break;

          case PACKET_PAYLOAD:
            this.packet.crc = byte << 8;
            this.packetState = PACKET_CRC_SECOND;
            break;

          case PACKET_CRC_SECOND:
            this.packet.crc |= byte;

            if (this.packet.crc !== crc16(this.packet.payload)) {
              debug(`CRC "${crc16(this.packet.payload)}" doesn't match received CRC "${this.packet.crc}"`);
              this.resetState();
              break;
            }

            this.packetState = PACKET_CRC;
            break;

          case PACKET_CRC:
            if (byte !== 3) {
              debug(`Invalid End Packet Byte received: "${byte}"`);
            } else {
              this.push({
                type: this.packet.payload.readUInt8(0),
                payload: this.packet.payload.slice(1),
              });
            }

            this.resetState();
            this.buffer = data.slice(i + 1);
            break;
          default:
            debug(`Should never reach this packetState "${this.packetState}`);
        }
      } else if (byte === 2 || byte === 3) {
        this.packetStartFound = true;
        this.packetState = PACKET_HEADER;
        this.packet.packetType = byte;
        this.position = 1;
      } else {
        debug(`Unknown byte "${byte}" received at state "${this.packetState}"`);
      }
    }

    cb();
  }

  resetState() {
    this.packetState = 0;
    this.packet = { ...packetTemplate };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.buffer = Buffer.alloc(0);
  }

  /* eslint no-underscore-dangle: ["error", { "allow": ["flush"] }] */
  _flush(cb) {
    this.resetState();
    cb();
  }
}
