const index = require('./index');
const { MESSAGE_FW_VERSION } = require('./vesc-messages');
const { default: VescMessageHandler } = require('./vescMessageHandler');
const { default: VescMessageParser } = require('./vescMessageParser');

describe('the index', () => {
  it('should do nothing', () => {
    expect(index).toBeDefined();
  });
  /*
  it('should parse a complete VESC message', (done) => {
    const payload = Buffer.concat([
      MESSAGE_FW_VERSION.START,
      MESSAGE_FW_VERSION.PACKAGE,
      MESSAGE_FW_VERSION.END,
    ]);

    const vescMessageParser = new VescMessageParser();
    const vescMessageHandler = new VescMessageHandler(vescMessageParser);

    expect.assertions(5);

    vescMessageParser.subscribe((message) => {
      expect(message).toBeDefined();
      expect(message.type).toBe('COMM_FW_VERSION');
      expect(message.payload.version.major).toBe(5);
      expect(message.payload.version.minor).toBe(2);
      expect(message.payload.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
      done();
    });

    vescMessageHandler.queueMessage(payload);
  });

  it('should parse multiple VESC messages', (done) => {
    const payload = Buffer.concat([
      MESSAGE_FW_VERSION.START,
      MESSAGE_FW_VERSION.PACKAGE,
      MESSAGE_FW_VERSION.END,
    ]);

    expect.assertions(15);

    let count = 0;
    const vescMessageParser = new VescMessageParser();
    const vescMessageHandler = new VescMessageHandler(vescMessageParser);
    vescMessageParser.subscribe((message) => {
      expect(message).toBeDefined();
      expect(message.type).toBe('COMM_FW_VERSION');
      expect(message.payload.version.major).toBe(5);
      expect(message.payload.version.minor).toBe(2);
      expect(message.payload.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
      if (message.type === 'COMM_FW_VERSION') {
        count += 1;
      }
      if (count === 3) {
        done();
      }
    });
    vescMessageHandler.queueMessage(payload);
    vescMessageHandler.queueMessage(payload);
    vescMessageHandler.queueMessage(payload);
  });
  */
  it('should parse long VESC messages (COMM_SET_MCCONF)', (done) => {
    const payload1 = Buffer.from(new Uint8Array([
      3, 1, 213, 14, 251, 38, 185, 156, 1, 0, 2, 0, 66, 112, 0, 0, 194, 112, 0, 0, 66, 198, 0, 0,
      194, 112, 0, 0, 66, 200, 0, 0, 199, 195, 80, 0, 71, 195, 80, 0, 31, 64, 67, 150, 0, 0, 68,
      187, 128, 0, 65, 0, 0, 0, 66, 100, 0, 0, 65, 32, 0, 0, 65, 0, 0, 0, 1, 2, 88, 2, 188, 3, 82,
      3, 232, 5, 220, 0, 50, 37, 28, 73, 183, 27, 0, 201, 183, 27, 0, 39, 16, 39, 16, 39, 16, 67,
      22, 0, 0, 68, 137, 128, 0, 65, 32, 0, 0, 2, 108, 31, 64, 71, 156, 64, 0, 68, 22, 0, 0, 255,
      1, 3, 2, 5, 6, 4, 255, 68,
    ])); // 128 byte
    const payload2 = Buffer.from(new Uint8Array([
      250, 0, 0, 60, 245, 194, 143, 66, 72, 0, 0, 70, 156, 64, 0, 61, 245, 194, 143, 0, 67, 52, 0,
      0, 64, 224, 0, 0, 63, 128, 0, 0, 63, 128, 0, 0, 63, 211, 51, 51, 63, 211, 51, 51, 63, 0, 0,
      0, 0, 68, 250, 0, 0, 70, 234, 96, 0, 54, 234, 225, 139, 0, 0, 0, 0, 60, 117, 194, 143, 59,
      32, 144, 46, 76, 171, 169, 80, 61, 76, 204, 205, 65, 32, 0, 0, 67, 72, 0, 0, 68, 187, 128, 0,
      0, 0, 63, 102, 102, 102, 62, 76, 204, 205, 0, 10, 0, 0, 0, 10, 0, 5, 255, 255, 255, 255, 255,
      255, 255, 255, 67, 250, 0, 0, 69, 28, 64, 0, 0,
    ])); // 128 byte

    const payload3 = Buffer.from(new Uint8Array([
      0, 0, 0, 0, 9, 196, 3, 232, 2, 0, 65, 160, 0, 0, 64, 128, 0, 0, 65, 32, 0, 0, 68, 250, 0, 0,
      0, 15, 58, 131, 18, 111, 1, 1, 68, 255, 12, 221, 68, 253, 3, 35, 68, 250, 49, 129, 255, 254,
      0, 5, 255, 253, 0, 0, 0, 0, 0, 0, 1, 69, 28, 64, 0, 0, 0, 0, 0, 35, 40, 0, 200, 0, 200, 0,
      200, 0, 0, 3, 232, 60, 245, 194, 143, 66, 72, 0, 0, 59, 131, 18, 111, 59, 131, 18, 111, 56,
      209, 183, 23, 7, 208, 68, 97, 0, 0, 1, 70, 195, 80, 0, 60, 245, 194, 143, 0, 0, 0, 0, 57,
      209, 183, 23, 62, 76, 204, 205, 63, 128,
    ])); // 128 byte

    const payload4 = Buffer.from(new Uint8Array([
      0, 0, 0, 0, 60, 35, 215, 10, 61, 76, 204, 205, 59, 150, 187, 153, 61, 35, 215, 10, 0, 0, 1,
      244, 60, 163, 215, 10, 63, 0, 0, 0, 0, 0, 31, 253, 0, 0, 3, 25, 69, 59, 128, 0, 71, 8, 184,
      0, 70, 195, 80, 0, 69, 83, 64, 0, 0, 0, 63, 28, 40, 246, 1, 14, 64, 64, 0, 0, 61, 169, 251,
      231, 0, 3, 64, 192, 0, 0, 1, 17, 148, 25, 100, 0, 50, 0, 0, 0, 98, 30, 3,
    ])); // 91 byte

    const payload5 = Buffer.concat([
      MESSAGE_FW_VERSION.START,
      MESSAGE_FW_VERSION.PACKAGE,
      MESSAGE_FW_VERSION.END,
    ]);

    expect.assertions(4);

    const vescMessageParser = new VescMessageParser();
    const vescMessageHandler = new VescMessageHandler(vescMessageParser);
    let count = 0;
    vescMessageParser.subscribe((message) => {
      count += 1;
      expect(message).toBeDefined();
      if (count === 1) {
        expect(message.type).toBe('COMM_GET_MCCONF');
      }
      if (count === 2) {
        expect(message.type).toBe('COMM_FW_VERSION');
        done();
      }
    });
    vescMessageHandler.queueMessage(payload1);
    vescMessageHandler.queueMessage(payload2);
    vescMessageHandler.queueMessage(payload3);
    vescMessageHandler.queueMessage(payload4);

    vescMessageHandler.queueMessage(payload5);
  });
});
