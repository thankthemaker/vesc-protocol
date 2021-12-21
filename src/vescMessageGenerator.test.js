import generatePacket from './vescMessageGenerator';

describe('The message generator', () => {
  it('should generate a COMM_GET_VALUES message', () => {
    const buf = generatePacket(Buffer.from([0x04]));
    expect(buf).toBeDefined();
    expect(new Uint8Array(buf.buffer).toString()).toStrictEqual('2,1,4,64,132,3');
  });
});
