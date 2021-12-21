import crc16 from './crc16';

const payload = '020100000003';
const expectedSum = 31731;

describe('crc16 checks', () => {
  test('it should match crc16', () => {
    expect(crc16(payload)).toEqual(expectedSum);
  });
});
