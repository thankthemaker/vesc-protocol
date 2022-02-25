import { PacketTypes } from './packetType';

describe('The packetType', () => {
  it('should be equal to 0 for COMM_FW_VERSION', () => {
    expect(PacketTypes.COMM_FW_VERSION).toBe(0);
  });
});
