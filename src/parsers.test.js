import VescBuffer from './vescBuffer';
import {
  bufferToArray,
  getFWVersion,
  getValues,
  getDecodedPPM,
  getStatus1,
  getStatus2,
  getStatus3,
  getStatus4,
  getStatus5,
  getValuesSelective,
  getBalanceData,
} from './parsers';
import {
  MESSAGE_GET_VALUES,
  MESSAGE_GET_DECODED_PPM,
  MESSAGE_STATUS_1,
  MESSAGE_STATUS_2,
  MESSAGE_STATUS_3,
  MESSAGE_STATUS_4,
  MESSAGE_STATUS_5,
  MESSAGE_GET_VALUES_SELECTIVE,
  MESSAGE_COMM_GET_IMU_DATA,
  MESSAGE_FW_VERSION,
} from './vesc-messages';

describe('The parser', () => {
  it('should return an array', () => {
    const payload = Buffer.from('020100000003');
    expect(bufferToArray(payload))
      .toStrictEqual(['30', '32', '30', '31', '30', '30', '30', '30', '30', '30', '30', '33']);
  });

  it('should return the Firmware version', () => {
    const payload = MESSAGE_FW_VERSION.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getFWVersion(buffer).then((data) => {
      expect(data.version.major).toBe(5);
      expect(data.version.minor).toBe(2);
      expect(data.hardware).toBe('Cheap FOCer 2 v0.9+ v1');
      expect(data.uuid).toStrictEqual(['3c', '00', '37', '00', '0b', '47', '33', '33', '33', '34', '35']);
    });
  });

  it('should return the values', () => {
    const payload = MESSAGE_GET_VALUES.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getValues(buffer).then((data) => {
      expect(data.temp.mosfet).toBe(51.2);
      expect(data.temp.motor).toBe(51.6);
      expect(data.current.motor).toBe(286.72);
      expect(data.current.battery).toBe(110.11);
      expect(data.id).toBe(0);
      expect(data.iq).toBe(0);
      expect(data.dutyCycle).toBe(0);
      expect(data.erpm).toBe(17999);
      expect(data.voltage).toBe(61.3);
      expect(data.ampHours.consumed).toBe(210.9952);
      expect(data.ampHours.charged).toBe(0);
      expect(data.wattHours.consumed).toBe(0);
      expect(data.wattHours.charged).toBe(0);
      expect(data.tachometer.value).toBe(32);
      expect(data.tachometer.abs).toBe(1982869049);
      expect(data.faultCode).toBe(3);
    });
  });

  it('should return the decoded PPM', () => {
    const payload = MESSAGE_GET_DECODED_PPM.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getDecodedPPM(buffer).then((data) => {
      expect(data.decodedPPM).toBe(84.034408);
    });
  });

  it('should return the status 1', () => {
    const payload = MESSAGE_STATUS_1.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getStatus1(buffer).then((data) => {
      expect(data.erpm).toBe(100);
      expect(data.current).toBe(5.5);
      expect(data.dutyCycle).toBe(77);
    });
  });

  it('should return the status 2', () => {
    const payload = MESSAGE_STATUS_2.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getStatus2(buffer).then((data) => {
      expect(data.ampHours.consumed).toBe(19.661);
      expect(data.ampHours.charged).toBe(6.6816);
    });
  });

  it('should return the status 3', () => {
    const payload = MESSAGE_STATUS_3.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getStatus3(buffer).then((data) => {
      expect(data.wattHours.consumed).toBe(19.661);
      expect(data.wattHours.charged).toBe(6.6816);
    });
  });

  it('should return the status 4', () => {
    const payload = MESSAGE_STATUS_4.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getStatus4(buffer).then((data) => {
      expect(data.temp.mosfet).toBe(42.3);
      expect(data.temp.motor).toBe(31.2);
      expect(data.totalCurrentIn).toBe(10.1);
      expect(data.pidPosition).toBe(1.0);
    });
  });

  it('should return the status 5', () => {
    const payload = MESSAGE_STATUS_5.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getStatus5(buffer).then((data) => {
      expect(data.tachometer.value).toBe(10);
      expect(data.voltage).toBe(45.3);
    });
  });

  it('should return the valueSelective command', () => {
    const payload = MESSAGE_GET_VALUES_SELECTIVE.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getValuesSelective(buffer).then((data) => {
      expect(data.temp.mosfet).toBe(42.3);
      expect(data.temp.motor).toBe(31.2);
      expect(data.dutyCycle).toBe(25.6);
      expect(data.erpm).toBe(100);
      expect(data.voltage).toBe(45.3);
      expect(data.tachometer.value).toBe(65536);
      expect(data.tachometer.abs).toBe(131072);
      expect(data.faultCode).toBe(1);
    });
  });

  it('should return the balancedata command', () => {
    const payload = MESSAGE_COMM_GET_IMU_DATA.PACKAGE;
    const buffer = new VescBuffer(payload);
    return getBalanceData(buffer).then((data) => {
      expect(data.pidOutput).toBe(0.131072);
      expect(data.pitch).toBe(0.131072);
      expect(data.roll).toBe(0.131072);
      expect(data.loopTime).toBe(10);
      expect(data.motorCurrent).toBe(0);
      expect(data.motorPosition).toBe(0);
      expect(data.balanceState).toBe(0);
      expect(data.switchState).toBe(0);
      expect(data.adc1).toBe(0);
      expect(data.adc2).toBe(0);
    });
  });
});
