import Debug from 'debug';
import { Transform } from 'stream';
import VescBuffer from './vescBuffer';
import PacketTypes from './packetType';
import { getFWVersion, getValues, getDecodedPPM } from './parsers';

const debug = Debug('vesc:packet:parser');

export default class VescPacketParser extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  pushResult(type, payload) {
    debug(`pushResult: "${type}, ${JSON.stringify(payload)}"`);
    return super.push({
      type,
      payload,
    });
  }

  /* eslint no-underscore-dangle: ["error", { "allow": ["_transform"] }] */
  _transform(chunk, encoding, callback) {
    const buffer = new VescBuffer(chunk.payload);
    const packetType = Object.keys(PacketTypes)[chunk.type];

    debug(`Received PacketType: "${packetType}"`);

    switch (chunk.type) {
      case PacketTypes.COMM_FW_VERSION:
        getFWVersion(buffer).then((result) => this.pushResult(packetType, result));
        break;

      case PacketTypes.COMM_GET_VALUES:
        getValues(buffer).then((result) => this.pushResult(packetType, result));
        break;

      case PacketTypes.COMM_GET_DECODED_PPM:
        getDecodedPPM(buffer).then((result) => this.pushResult(packetType, result));
        break;

      default:
        debug(`Unknown packet type "${chunk.type}"`);
    }

    callback();
  }
}
