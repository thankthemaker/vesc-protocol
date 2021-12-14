const crc16 = require('./crc16');

const payload = '020100000003';
const expectedSum = 31731;

describe('crc16 checks', () => {
  test('it should match crc16', () => {
    expect(crc16(payload)).toEqual(expectedSum);
  });
});
