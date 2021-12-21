/* eslint no-bitwise: "off" */
import crc16 from './crc16';

// Beginning (1 byte), Length (1 byte), CRC16 (2 bytes), End Byte (1 byte)
const PACKET_SIZE_WITHOUT_PAYLOAD = 1 + 1 + 2 + 1;
/**
 * @param {Buffer} payload
 */
export default function generatePacket(payload) {
  let buffer;
  let index = 0;

  if (payload.length <= 256) {
    buffer = Buffer.alloc(payload.length + PACKET_SIZE_WITHOUT_PAYLOAD);

    buffer.writeUInt8(2, index);
    index += 1;
    buffer.writeUInt8(payload.length, index);
    index += 1;
  } else {
    buffer = Buffer.alloc(payload.length + 1 + PACKET_SIZE_WITHOUT_PAYLOAD);

    buffer.writeUInt8(3, index);
    index += 1;
    buffer.writeUInt8(payload.length >> 8, index);
    index += 1;
    buffer.writeUInt8(payload.length & 0xFF, index);
    index += 1;
  }

  for (let i = 0; i < payload.length; i += 1, index += 1) {
    buffer.writeUInt8(payload[i], index);
  }

  const crc = crc16(payload);

  buffer.writeUInt8(crc >> 8, index);
  index += 1;
  buffer.writeUInt8(crc & 0xFF, index);
  index += 1;
  buffer.writeUInt8(3, index);

  return buffer;
}
