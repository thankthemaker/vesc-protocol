export default class VescBuffer {
  /**
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.buffer = buffer;
    this.index = 0;
  }

  raw() {
    return this.buffer;
  }

  size() {
    return this.buffer.length;
  }

  readString() {
    let value = '';
    let charCode;
    let char = '';
    while (charCode !== 0x00 && this.index < this.buffer.length) {
      value = `${value}${char}`;
      charCode = this.readUInt8();
      char = String.fromCharCode(charCode);
    }

    return value;
  }

  slice(expected) {
    if ((this.index + expected) <= this.buffer.length) {
      const value = this.buffer.slice(this.index, this.index + expected - 1);
      this.index += expected - 1;
      return value;
    }

    return Buffer.from([]);
  }

  readUInt8() {
    const value = this.buffer.readUInt8(this.index);
    this.index += 1;

    return value;
  }

  readUInt16() {
    const value = this.buffer.readUInt16BE(this.index);

    this.index += 2;

    return value;
  }

  readUInt32() {
    const value = this.buffer.readUInt32BE(this.index);
    this.index += 4;

    return value;
  }

  readInt8() {
    const value = this.buffer.readInt8(this.index);
    this.index += 1;

    return value;
  }

  readInt16() {
    const value = this.buffer.readInt16BE(this.index);
    this.index += 2;

    return value;
  }

  readInt32() {
    const value = this.buffer.readInt32BE(this.index);
    this.index += 4;

    return value;
  }

  readDouble16(scale) {
    return this.readInt16() / scale;
  }

  readDouble32(scale) {
    return this.readInt32() / scale;
  }
}
