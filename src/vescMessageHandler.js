/* eslint no-bitwise: "off" */
/* eslint no-restricted-syntax: "off" */
import logger from 'loglevel';
import { Subject } from 'rxjs';
import crc16 from './crc16';

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

export default class VescMessageHandler {
  constructor(parser) {
    this.vescMessageParser = parser;
    this.vescMessages = new Subject();
    this.buffer = Buffer.alloc(0);
    this.packet = { ...packetTemplate };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.packetState = 0;

    this.vescMessages.subscribe((message) => {
      const data = Buffer.concat([this.buffer, message]);
      for (const [i, byte] of data.entries()) {
        if (this.packetStartFound) {
          switch (this.packetState) {
            case PACKET_HEADER:
              if (this.packet.packetType === 2) {
                this.packet.packetSize = byte;
                this.packetState = PACKET_LENGTH;
                logger.debug(`PACKET_HEADER received short package: ${this.packet.packetType}, packetSize: ${this.packet.packetSize}`);
              } else {
                this.packet.packetSize = byte << 8;
                this.packetState = PACKET_LENGTH_SECOND;
                logger.debug(`PACKET_HEADER received long package: ${this.packet.packetType}, packetSize: ${this.packet.packetSize}`);
              }
              break;

            case PACKET_LENGTH_SECOND:
              this.packet.packetSize |= byte;
              this.packetState = PACKET_LENGTH;
              logger.debug(`PACKET_LENGTH_SECOND packetSize: ${this.packet.packetSize}`);
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
              logger.debug(`PACKET_LENGTH position: ${this.payloadPosition}`);
              break;

            case PACKET_PAYLOAD:
              this.packet.crc = byte << 8;
              this.packetState = PACKET_CRC_SECOND;
              logger.debug(`PACKET_PAYLOAD crc: ${this.packet.crc}, byte ${byte}`);
              break;

            case PACKET_CRC_SECOND:
              this.packet.crc |= byte;
              logger.debug(`PACKET_CRC_SECOND crc: ${this.packet.crc}, byte ${byte}`);

              if (this.packet.crc !== crc16(this.packet.payload)) {
                logger.debug(`CRC "${crc16(this.packet.payload)}" doesn't match received CRC "${this.packet.crc}"`);
                this.resetState();
                break;
              }

              this.packetState = PACKET_CRC;
              break;

            case PACKET_CRC:
              if (byte !== 3) {
                logger.debug(`Invalid End Packet Byte received: "${byte}"`);
              } else {
                this.vescMessageParser.queueMessage({
                  type: this.packet.payload.readUInt8(0),
                  payload: this.packet.payload.slice(1),
                });
              }

              this.resetState();
              this.buffer = data.slice(i + 1);
              break;
            default:
              logger.debug(`Should never reach this packetState "${this.packetState}`);
          }
        } else if (byte === 2 || byte === 3) {
          this.packetStartFound = true;
          this.packetState = PACKET_HEADER;
          this.packet.packetType = byte;
          this.position = 1;
        } else {
          logger.debug(`Unknown byte "${byte}" received at state "${this.packetState}"`);
        }
      }
    });
  }

  queueMessage(message) {
    this.vescMessages.next(message);
  }

  resetState() {
    this.packetState = 0;
    this.packet = { ...packetTemplate };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.buffer = Buffer.alloc(0);
  }
}
