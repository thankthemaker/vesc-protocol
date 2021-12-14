import VescBuffer from './vescBuffer';

const payload = Buffer.from('020100000003');
describe('the vescBuffer', () => {
  it('should return the raw value', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.raw()).toEqual(payload);
  });

  it('should return the size', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.size()).toEqual(12);
  });

  it('should read a string', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readString()).toEqual('02010000000');
  });

  it('should slice the buffer', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.slice(5)).toBeDefined();
  });

  it('should return the buffer when slice is greater', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.slice(20)).toBeDefined();
  });

  it('should read an UInt8', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readUInt8()).toEqual(48);
  });

  it('should read an UInt16', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readUInt16()).toEqual(12338);
  });

  it('should read an UInt32', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readUInt32()).toEqual(808595505);
  });

  it('should read an Int8', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readInt8()).toEqual(48);
  });

  it('should read an Int16', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readInt16()).toEqual(12338);
  });

  it('should read an Int32', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readInt32()).toEqual(808595505);
  });

  it('should read a Double12', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readDouble16(10)).toEqual(1233.8);
  });

  it('should read Double32', () => {
    const buffer = new VescBuffer(payload);
    expect(buffer.readDouble32(10)).toEqual(80859550.5);
  });
});
