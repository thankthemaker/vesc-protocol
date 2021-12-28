export const MESSAGE_FW_VERSION = {
  START: Buffer.from(new Uint8Array([
    2, // short package
    42, // 42 byte
    0, // COMM_FW_VERSION
  ])),
  PACKAGE: Buffer.from(new Uint8Array([
    5, // major
    2, // minor
    67, 104, 101, 97, 112, 32, 70, 79, 67, 101, 114, // hardware
    32, 50, 32, 118, 48, 46, 57, 43, 32, 118, 49, 0, // hardware continued
    60, 0, 55, 0, 11, 71, 51, 51, 51, 52, 53, 51, // uuid
  ])),
  END: Buffer.from(new Uint8Array([
    0, 0,
    0, 0,
    222, 50, // CRC
    3, // package end
  ])),
};

export const MESSAGE_GET_VALUES = {
  PACKAGE: Buffer.from(new Uint8Array([
    2, 0, // temp.mosfet
    2, 4, // temp.motor
    0, 0, 112, 0, // current.motor
    0, 0, 43, 3, // current.battery
    0, 0, 0, 0, // id
    0, 0, 0, 0, // iq
    0, 200, // dutyCycle
    0, 0, 70, 79, // erpm
    2, 101, // voltage
    0, 32, 50, 0, // ampHours.consumed
    0, 0, 0, 0, // ampHours.charged
    0, 0, 0, 0, // wattHours.consumed
    0, 0, 0, 0, // wattHours.charged
    0, 0, 0, 32, // tachometer.value
    118, 48, 46, 57, // tachometer.abs
    3, // faultCode
  ])),
};

export const MESSAGE_GET_DECODED_PPM = {
  PACKAGE: Buffer.from(new Uint8Array([
    5, 2, 67, 104, // decodedPPM
    101, 97, 112, 32, // ppmLastLen
  ])),
};

export const MESSAGE_GET_DECODED_ADC = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 2, 67, 104, // level1
    0, 48, 112, 32, // voltage1
    0, 2, 67, 104, // level2
    0, 48, 112, 32, // voltage2
  ])),
};

export const MESSAGE_STATUS_1 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 0, 0, 100, // erpm
    0, 55, // current
    0, 77, // dutyCycle
  ])),
};

export const MESSAGE_STATUS_2 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 3, 0, 2, // ampHours.consumed
    0, 1, 5, 0, // ampHours.consumed
  ])),
};

export const MESSAGE_STATUS_3 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 3, 0, 2, // wattHours.consumed
    0, 1, 5, 0, // wattHours.charged
  ])),
};

export const MESSAGE_STATUS_4 = {
  PACKAGE: Buffer.from(new Uint8Array([
    1, 167, // temp.mosfet
    1, 56, // temp.motor
    0, 101, // totalCurrentIn
    0, 50, // pidPosition
  ])),
};

export const MESSAGE_STATUS_5 = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 0, 0, 10, // tachometer.value
    1, 197, 0, 0, // voltage
  ])),
};

export const MESSAGE_GET_VALUES_SELECTIVE = {
  PACKAGE: Buffer.from(new Uint8Array([
    1, 167, // mosfet
    1, 56, // motor
    100, 0, // dutyCycle
    0, 0, 0, 100, // erpm
    1, 197, // voltage
    0, 1, 0, 0, // tachometer.value
    0, 2, 0, 0, // tachometer.abs
    1, // faultCode
  ])),
};

export const MESSAGE_COMM_GET_IMU_DATA = {
  PACKAGE: Buffer.from(new Uint8Array([
    0, 2, 0, 0, // pidOutput
    0, 2, 0, 0, // pitch
    0, 2, 0, 0, // roll
    0, 0, 0, 10, // loopTime
    0, 0, 0, 0, // motorCurrent
    0, 0, 0, 0, // motorPosition
    0, 0, 0, 0, // balanceState
    0, 0, // switchState
    0, 0, 0, 0, // adc1
    0, 0, 0, 0, // adc2
  ])),
};

export const MESSAGE_COMM_BMS_GET_VALUES = {
  PACKAGE: Buffer.from(new Uint8Array([
    2, 222, 78, 8, // v_tot 48.1234
    0, 0, 0, 0, // v_charge
    0, 0, 0, 0, // i_in
    0, 0, 0, 0, // i_in_iv
    0, 0, 0, 0, // ah_cnt
    0, 0, 0, 0, // wh_cnt
    12, // cell_num
    15, 170, // voltage cell1 4.01
    15, 170, // voltage cell2 4.01
    15, 170, // voltage cell3 4.01
    15, 170, // voltage cell4 4.01
    15, 170, // voltage cell5 4.01
    15, 170, // voltage cell6 4.01
    15, 170, // voltage cell7 4.01
    15, 170, // voltage cell8 4.01
    15, 170, // voltage cell9 4.01
    15, 170, // voltage cell10 4.01
    15, 170, // voltage cell11 4.01
    15, 170, // voltage cell12 4.01
    0, 100, // balance state cell1
    0, 100, // balance state cell2
    0, 100, // balance state cell3
    0, 100, // balance state cell4
    0, 100, // balance state cell5
    0, 100, // balance state cell6
    0, 100, // balance state cell7
    0, 100, // balance state cell8
    0, 100, // balance state cell9
    0, 100, // balance state cell10
    0, 100, // balance state cell11
    0, 100, // balance state cell12
    2, // temp_adc_num
    14, 43, // temps_adc1 36.27
    1, 76, // temps_adc2
    1, 56, // temp_it
    0, 0, // hum_ic
    0, 0, // hum
    8, 70, // temp_max_cell 21.18
    0, 0, // soc
    0, 0, // soh
  ])),
};

export const MESSAGE_COMM_GET_APPCONF = {
  START: Buffer.from(new Uint8Array([
    3, // long package
    1, // Length Byte1
    202, // Length Byte2
    17, // COMM_GET_APPCONF
  ])),
  PACKAGE: Buffer.from(new Uint8Array([
    162, 61, 165, 36, // APP_CONF signature
    25, // controller_id
    0, 0, 3, 232, // timeout_msec
    0, 0, 0, 1, // timeout_brake_current
    7, // send_can_status
    0, 50, // send_can_status_rate_hz
    2, // can_baud_rate
    0, // pairing_done
    1, // permanent_uart_enabled
    7, // shutdown_mode
    1, // can_mode
    2, // uavcan_esc_index
    3, // uavcan_raw_mode
    4, // app_to_use
    0, // app_ppm_conf.ctrl_type
    0, 70, 106, 96, // app_ppm_conf.pid_max_erpm
    62, 25, 153, 154, // app_ppm_conf.hyst
    63, 128, 0, 0, // app_ppm_conf.pulse_start
    64, 0, 0, 0, // app_ppm_conf.pulse_end
    63, 192, 0, 0, // pp_ppm_conf.pulse_center
    1, // app_ppm_conf.median_filter
    1, // app_ppm_conf.safe_start
    0, 0, 0, 0, // app_ppm_conf.throttle_exp
    0, 0, 0, 0, // app_ppm_conf.throttle_exp_brake
    2, // app_ppm_conf.throttle_exp_mode
    62, 204, 204, 205, // app_ppm_conf.ramp_time_pos
    62, 76, 204, 205, // app_ppm_conf.ramp_time_neg
    1, // app_ppm_conf.multi_esc
    0, // app_ppm_conf.tc
    69, 59, 128, 0, // app_ppm_conf.tc_max_diff
    69, 122, 0, 0, // app_ppm_conf.max_erpm_for_dir
    61, 143, 92, 41, // app_ppm_conf.smart_rev_max_duty
    64, 64, 0, 0, // app_ppm_conf.smart_rev_ramp_time
    0, 62, 25, 153, // app_adc_conf.hyst
    154, 63, 102, 102, // app_adc_conf.voltage_start
    102, 64, 64, 0, // app_adc_conf.voltage_end
    0, 64, 0, 0, // app_adc_conf.voltage_center
    0, 63, 102, 102, // app_adc_conf.voltage2_start
    102, 64, 64, 0, // app_adc_conf.voltage2_end
    0, // app_adc_conf.use_filter
    1, // app_adc_conf.safe_start
    1, // app_adc_conf.cc_button_inverted
    0, // app_adc_conf.rev_button_inverted
    0, // app_adc_conf.voltage_inverted
    0, // app_adc_conf.voltage2_inverted
    0, 0, 0, 0, // app_adc_conf.throttle_exp
    0, 0, 0, 0, // app_adc_conf.throttle_exp_brake
    0, 2, 62, 153, 153,
    154, 61, 204, 204, 205, 1, 0, 69, 59, 128, 0, 1, 244, 0, 1, 194, 0, 1, 62, 25,
    153, 154, 62, 204, 204, 205, 62, 76, 204, 205, 69, 59, 128, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 1, 0, 69, 59, 128, 0, 1, 61, 143, 92, 41, 64, 64, 0, 0, 1, 3, 1, 0,
    3, 76, 198, 199, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 232, 65, 160, 0,
    0, 66, 52, 0, 0, 63, 102, 102, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 3, 232, 65, 112, 0, 0, 64, 160, 0, 0, 63, 64, 0, 0, 67, 72, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 244, 65, 160, 0, 0, 65, 0, 0, 0, 65, 240, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 65, 0, 0, 0, 63, 128, 0, 0, 0, 0, 0, 0, 65, 32, 0, 0,
    64, 160, 0, 0, 64, 160, 0, 0, 0, 0, 0, 0, 63, 115, 51, 51, 0, 0, 0, 0, 64, 160,
    0, 0, 63, 128, 0, 0, 0, 100, 64, 160, 0, 0, 0, 20, 78, 32, 0, 0, 0, 100, 0, 100,
    7, 8, 0, 0, 24, 1, 0, 60, 0, 30, 1, 244, 1, 0, 0, 200, 63, 128, 0, 0, 62, 153,
    153, 154, 0, 0, 0, 0, 61, 204, 204, 205, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 64, 160, 0, 0, 128, 65, 3,
  ])),
  END: Buffer.from(new Uint8Array([])),
};

export function generateMessage(type) {
  return Buffer.concat([
    type.START,
    type.PACKAGE,
    type.END,
  ]);
}
