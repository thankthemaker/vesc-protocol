import logger from 'loglevel';
import { Subject } from 'rxjs';
import VescBuffer from './vescBuffer';
import PacketTypes from './packetType';
import {
  getFWVersion,
  getValues,
  getDecodedPPM,
  getMotorConfiguration,
  getAppConfiguration,
} from './parsers';

export default class VescMessageParser extends Subject {
  constructor() {
    super();
    this.vescMessages = new Subject();
    this.vescMessages.subscribe((message) => {
      const buffer = new VescBuffer(message.payload);
      const packetType = Object.keys(PacketTypes)[message.type];

      logger.debug(`Received PacketType: "${packetType}"`);

      switch (message.type) {
        case PacketTypes.COMM_FW_VERSION:
          getFWVersion(buffer).then((result) => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_MCCONF:
          getMotorConfiguration(buffer).then((result) => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_APPCONF:
          getAppConfiguration(buffer).then((result) => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_VALUES:
          getValues(buffer).then((result) => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_DECODED_PPM:
          getDecodedPPM(buffer).then((result) => this.pushResult(packetType, result));
          break;

        default:
          logger.debug(`Unknown packet type "${message.type}"`);
      }
    });
  }

  pushResult(type, payload) {
    logger.debug(`pushResult: "${type}, ${JSON.stringify(payload)}"`);
    this.next({
      type,
      payload,
    });
  }

  queueMessage(message) {
    this.vescMessages.next(message);
  }
}
