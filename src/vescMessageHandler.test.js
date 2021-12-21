import { generateMessage, MESSAGE_FW_VERSION } from './vesc-messages';
import VescMessageHandler from './vescMessageHandler';
import VescMessageParser from './vescMessageParser';

describe('The vescMessageHandler', () => {
  jest.mock('./vescMessageParser');
  const parser = new VescMessageParser();
  const queueMessage = jest.spyOn(parser, 'queueMessage');

  const vescMessageHandler = new VescMessageHandler(parser);
  const payload = generateMessage(MESSAGE_FW_VERSION);

  it('should process a message', (done) => {
    vescMessageHandler.queueMessage(payload);
    expect(queueMessage).toBeCalled();
    done();
  });
});
