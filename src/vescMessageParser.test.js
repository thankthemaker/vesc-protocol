import { PacketTypes } from '.';
import {
  MESSAGE_FW_VERSION,
  MESSAGE_GET_DECODED_PPM,
  MESSAGE_GET_VALUES,
  MESSAGE_GET_VALUES_SETUP_SELECTIVE,
} from './vesc-messages';
import VescMessageParser from './vescMessageParser';

describe('The VescMessageParser', () => {
  it('should parse a COMM_FW_VERSION message', (done) => {
    const vescMessageParser = new VescMessageParser();
    const payload = {
      payload: MESSAGE_FW_VERSION.PACKAGE,
      type: PacketTypes.COMM_FW_VERSION,
    };

    expect.assertions(4);

    vescMessageParser.queueMessage(payload);
    vescMessageParser.subscribe((message) => {
      expect(message.type).toBe('COMM_FW_VERSION');
      expect(message.payload.version.major).toBe(5);
      expect(message.payload.version.minor).toBe(2);
      expect(message.payload.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
      done();
    });
  });

  it('should parse a COMM_GET_VALUES message', (done) => {
    const vescMessageParser = new VescMessageParser();
    const payload = {
      payload: MESSAGE_GET_VALUES.PACKAGE,
      type: PacketTypes.COMM_GET_VALUES,
    };

    expect.assertions(6);

    vescMessageParser.queueMessage(payload);
    vescMessageParser.subscribe((message) => {
      expect(message.type).toBe('COMM_GET_VALUES');
      expect(message.payload.dutyCycle).toBe(0.2);
      expect(message.payload.temp.mosfet).toBe(51.2);
      expect(message.payload.temp.motor).toBe(51.6);
      expect(message.payload.current.motor).toBe(286.72);
      expect(message.payload.current.battery).toBe(110.11);
      done();
    });
  });

  it('should parse a COMM_GET_VALUES_SETUP_SELECTIVE message', (done) => {
    const vescMessageParser = new VescMessageParser();
    const payload = {
      payload: MESSAGE_GET_VALUES_SETUP_SELECTIVE.PACKAGE,
      type: PacketTypes.COMM_GET_VALUES_SETUP_SELECTIVE,
    };

    expect.assertions(6);

    vescMessageParser.queueMessage(payload);
    vescMessageParser.subscribe((message) => {
      expect(message.type).toBe('COMM_GET_VALUES_SETUP_SELECTIVE');
      expect(message.payload.temp.mosfet).toBe(42.3);
      expect(message.payload.temp.motor).toBe(31.2);
      expect(message.payload.dutyCycle).toBe(25.6);
      expect(message.payload.tachometer.value).toBe(65536);
      expect(message.payload.tachometer.abs).toBe(131072);
      done();
    });
  });

  it('should parse a COMM_GET_DECODED_PPM message', (done) => {
    const vescMessageParser = new VescMessageParser();
    const payload = {
      payload: MESSAGE_GET_DECODED_PPM.PACKAGE,
      type: PacketTypes.COMM_GET_DECODED_PPM,
    };

    expect.assertions(3);

    vescMessageParser.queueMessage(payload);
    vescMessageParser.subscribe((message) => {
      expect(message.type).toBe('COMM_GET_DECODED_PPM');
      expect(message.payload.decodedPPM).toBe(84.034408);
      expect(message.payload.ppmLastLen).toBe(1700.884512);
      done();
    });
  });
});
