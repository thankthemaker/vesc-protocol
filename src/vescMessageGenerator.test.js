import generatePacket from './vescMessageGenerator';

describe('The message generator', () => {
  it('should generate a COMM_GET_VALUES message', () => {
    const buf = generatePacket(Buffer.from([0x04]));
    expect(buf).toBeDefined();
    expect(new Uint8Array(buf.buffer).toString()).toStrictEqual('2,1,4,64,132,3');
  });

  it('should generate a COMM_GET_VALUES_SELECTIVE message', () => {
    const buf = generatePacket(Buffer.from([0x32, 0x00, 0x00, 0x87, 0xC3]));
    expect(buf).toBeDefined();
    expect(new Uint8Array(buf.buffer).toString()).toStrictEqual('2,5,50,0,0,135,195,35,77,3');
  });

  it('should generate a long message', () => {
    let tempbuf = Buffer.from([0x11]);
    for (let i = 0; i < 256; i += 1) {
      tempbuf = Buffer.concat([tempbuf, Buffer.from([0x00])]);
    }
    const buf = generatePacket(tempbuf);
    expect(buf).toBeDefined();
    expect(buf.buffer.byteLength).toBe(263);
    expect(new Uint8Array(buf.buffer.slice(0, 4)).toString()).toStrictEqual('3,1,1,17');
  });
});
