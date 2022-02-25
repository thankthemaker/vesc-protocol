/**
 * @param {Buffer} buffer
 */
export function bufferToArray(buffer) {
  return [...buffer].map((byte) => byte.toString(16)).map((byte) => {
    if (byte.length < 2) {
      return `0${byte}`;
    }

    return byte;
  });
}

/**
 * @param {VescBuffer} payload
 */
export function getFWVersion(payload) {
  const response = {
    version: {
      major: -1,
      minor: -1,
    },
    hardware: 'UNKNOWN',
    uuid: null,
  };

  if (payload.size() >= 2) {
    response.version.major = payload.readUInt8();
    response.version.minor = payload.readUInt8();
    response.hardware = payload.readString();
    response.uuid = bufferToArray(payload.slice(12));
  }

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getValues(payload) {
  const response = {
    temp: {
      mosfet: 0.0,
      motor: 0.0,
    },
    current: {
      motor: 0.0,
      battery: 0.0,
    },
    id: 0.0,
    iq: 0.0,
    dutyCycle: 0.0,
    erpm: 0.0,
    voltage: 0.0,
    ampHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    wattHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    tachometer: {
      value: 0.0,
      abs: 0.0,
    },
    faultCode: 0,
  };

  response.temp.mosfet = payload.readDouble16(1e1);
  response.temp.motor = payload.readDouble16(1e1);
  response.current.motor = payload.readDouble32(1e2);
  response.current.battery = payload.readDouble32(1e2);
  response.id = payload.readDouble32(1e2);
  response.iq = payload.readDouble32(1e2);
  response.dutyCycle = payload.readDouble16(1e3);
  response.erpm = payload.readDouble32(1e0);
  response.voltage = payload.readDouble16(1e1);
  response.ampHours.consumed = payload.readDouble32(1e4);
  response.ampHours.charged = payload.readDouble32(1e4);
  response.wattHours.consumed = payload.readDouble32(1e4);
  response.wattHours.charged = payload.readDouble32(1e4);
  response.tachometer.value = payload.readInt32();
  response.tachometer.abs = payload.readInt32();
  response.faultCode = payload.readInt8();

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getDecodedPPM(payload) {
  const response = {
    decodedPPM: 0.0,
    ppmLastLen: 0.0,
  };

  response.decodedPPM = payload.readDouble32(1e6);
  response.ppmLastLen = payload.readDouble32(1e6);

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getDecodedADC(payload) {
  const response = {
    level1: 0.0,
    voltage1: 0.0,
    level2: 0.0,
    voltage2: 0.0,
  };

  response.level1 = payload.readDouble32(1e6);
  response.voltage1 = payload.readDouble32(1e6);
  response.level2 = payload.readDouble32(1e6);
  response.voltage2 = payload.readDouble32(1e6);

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getStatus1(payload) {
  const response = {
    erpm: 0.0,
    dutyCycle: 0.0,
    current: 0.0,
  };

  response.erpm = payload.readInt32();
  response.current = payload.readDouble16(1e1);
  response.dutyCycle = payload.readUInt16();
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getStatus2(payload) {
  const response = {
    ampHours: {
      consumed: 0.0,
      charged: 0.0,
    },
  };

  response.ampHours.consumed = payload.readDouble32(1e4);
  response.ampHours.charged = payload.readDouble32(1e4);
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getStatus3(payload) {
  const response = {
    wattHours: {
      consumed: 0.0,
      charged: 0.0,
    },
  };

  response.wattHours.consumed = payload.readDouble32(1e4);
  response.wattHours.charged = payload.readDouble32(1e4);
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getStatus4(payload) {
  const response = {
    temp: {
      mosfet: 0.0,
      motor: 0.0,
    },
    totalCurrentIn: 0.0,
    pidPosition: 0.0,
  };

  response.temp.mosfet = payload.readDouble16(1e1);
  response.temp.motor = payload.readDouble16(1e1);
  response.totalCurrentIn = payload.readDouble16(1e1);
  response.pidPosition = payload.readDouble16(5e1);
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getStatus5(payload) {
  const response = {
    tachometer: {
      value: 0.0,
    },
    voltage: 0.0,
  };

  response.tachometer.value = payload.readDouble32(1e0);
  response.voltage = payload.readDouble16(1e1);
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getValuesSetupSelective(payload) {
/* eslint no-bitwise: ["error", { "allow": ["&", "<<"] }] */
  const response = {
    bitmask: 0,
    temp: {
      mosfet: 0.0,
      motor: 0.0,
    },
    current: {
      in: 0.0,
      in_total: 0.0,
    },
    dutyCycle: 0.0,
    erpm: 0.0,
    speed: 0.0,
    voltage: 0.0,
    batteryLevel: 0.0,
    ampHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    wattHours: {
      consumed: 0.0,
      charged: 0.0,
    },
    tachometer: {
      value: 0.0,
      abs: 0.0,
    },
    pidPos: 0.0,
    faultCode: 0,
    controllerId: 0,
    numVescs: 0,
    wattHoursLeft: 0.0,
    odoMeter: 0.0,
  };

  response.bitmask = payload.readDouble32(1e0);
  const mask = response.bitmask;
  if (mask & (1 << 0)) {
    response.temp.mosfet = payload.readDouble16(1e1);
  }
  if (mask & (1 << 1)) {
    response.temp.motor = payload.readDouble16(1e1);
  }
  if (mask & (1 << 2)) {
    response.current.in = payload.readDouble32(1e2);
  }
  if (mask & (1 << 3)) {
    response.current.in_total = payload.readDouble32(1e2);
  }
  if (mask & (1 << 4)) {
    response.dutyCycle = payload.readDouble16(1e3);
  }
  if (mask & (1 << 5)) {
    response.erpm = payload.readDouble32(1e0);
  }
  if (mask & (1 << 6)) {
    response.speed = payload.readDouble32(1e3);
  }
  if (mask & (1 << 7)) {
    response.voltage = payload.readDouble16(1e1);
  }
  if (mask & (1 << 8)) {
    response.batteryLevel = payload.readDouble16(1e3);
  }
  if (mask & (1 << 9)) {
    response.ampHours.consumed = payload.readDouble32(1e4);
  }
  if (mask & (1 << 10)) {
    response.ampHours.charged = payload.readDouble32(1e4);
  }
  if (mask & (1 << 11)) {
    response.wattHours.consumed = payload.readDouble32(1e4);
  }
  if (mask & (1 << 12)) {
    response.wattHours.charged = payload.readDouble32(1e4);
  }
  if (mask & (1 << 13)) {
    response.tachometer.value = payload.readInt32();
  }
  if (mask & (1 << 14)) {
    response.tachometer.abs = payload.readInt32();
  }
  if (mask & (1 << 15)) {
    response.pidPos = payload.readDouble32(1e6);
  }
  if (mask & (1 << 16)) {
    response.faultCode = payload.readInt8();
  }
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getBalanceData(payload) {
  const response = {
    pid: 0.0,
    pitch: 0.0,
    roll: 0.0,
    loopTime: 0.0,
    motorCurrent: 0.0,
    motorPosition: 0.0,
    balanceState: 0.0,
    switchState: 0.0,
    adc1: 0.0,
    adc2: 0.0,
  };

  response.pidOutput = payload.readDouble32(1e6);
  response.pitch = payload.readDouble32(1e6);
  response.roll = payload.readDouble32(1e6);
  response.loopTime = payload.readDouble32(1e0);
  response.motorCurrent = payload.readDouble32(1e6);
  response.motorPosition = payload.readDouble32(1e6);
  response.balanceState = payload.readUInt16();
  response.switchState = payload.readUInt16();
  response.adc1 = payload.readDouble32(1e6);
  response.adc2 = payload.readDouble32(1e6);

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getBmsValues(payload) {
  const response = {
    v_tot: 0.0,
    v_charge: 0.0,
    i_in: 0.0,
    i_in_ic: 0.0,
    ah_cnt: 0.0,
    wh_cnt: 0.0,
    cell_num: 0,
    v_cell: [],
    bal_states: [],
    temp_adc_num: 0,
    temps_adc: [],
    temp_ic: 0.0,
    temp_hum: 0.0,
    hum: 0.0,
    temp_max_cell: 0.0,
    soc: 0.0,
    soh: 0.0,
  };

  response.v_tot = payload.readDouble32(1e6);
  response.v_charge = payload.readDouble32(1e6);
  response.i_in = payload.readDouble32(1e6);
  response.i_in_ic = payload.readDouble32(1e6);
  response.ah_cnt = payload.readDouble32(1e3);
  response.wh_cnt = payload.readDouble32(1e3);
  response.cell_num = payload.readInt8();
  for (let i = 0; i < response.cell_num; i += 1) {
    const cellVoltage = payload.readDouble16(1e3);
    response.v_cell.push(cellVoltage);
  }
  for (let i = 0; i < response.cell_num; i += 1) {
    const cellBalanceState = payload.readDouble16(1e3);
    response.bal_states.push(cellBalanceState);
  }
  response.temp_adc_num = payload.readInt8();
  for (let i = 0; i < response.temp_adc_num; i += 1) {
    const temp = payload.readDouble16(1e2);
    response.temps_adc.push(temp);
  }
  response.temp_ic = payload.readDouble16(1e2);
  response.temp_hum = payload.readDouble16(1e2);
  response.hum = payload.readDouble16(1e2);
  response.temp_max_cell = payload.readDouble16(1e2);
  response.soc = payload.readDouble16(1e3);
  response.soh = payload.readDouble16(1e3);
  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getMotorConfiguration(payload) {
  const response = {
    message: 'yeah',
    payload,
  };

  return Promise.resolve(response);
}

/**
 * @param {VescBuffer} payload
 */
export function getAppConfiguration(payload) {
  const response = {
    signature: 0,
    controller_id: 0,
    timeout_msec: 0.0,
    timeout_brake_current: 0.0,
    send_can_status: 0,
    send_can_status_rate_hz: 0,
    can_baud_rate: 0,
    pairing_done: 0,
    permanent_uart_enabled: 0,
    shutdown_mode: 0,
    can_mode: 0,
    uavcan_esc_index: 0,
    uavcan_raw_mode: 0,
    app_to_use: 0,
    app_ppm_conf: {
      ctrl_type: 0,
      pid_max_erpm: 0.0,
      hyst: 0.0,
      pulse_start: 0.0,
      pulse_end: 0.0,
      pulse_center: 0.0,
      median_filter: 0,
      safe_start: 0,
      throttle_exp: 0.0,
      throttle_exp_brake: 0.0,
      throttle_exp_mode: 0,
      ramp_time_pos: 0.0,
      ramp_time_neg: 0.0,
      multi_esc: 0,
      tc: 0,
      tc_max_diff: 0.0,
      max_erpm_for_dir: 0.0,
      smart_rev_max_duty: 0.0,
      smart_rev_ramp_time: 0.0,
    },
    app_adc_conf: {
      ctrl_type: 0,
      hyst: 0.0,
      voltage_start: 0.0,
      voltage_end: 0.0,
      voltage_center: 0.0,
      voltage2_start: 0.0,
      voltage2_end: 0.0,
      use_filter: 0,
      safe_start: 0,
      cc_button_inverted: 0,
      rev_button_inverted: 0,
      voltage_inverted: 0,
      voltage2_inverted: 0,
      throttle_exp: 0.0,
      throttle_exp_brake: 0.0,
    },
    app_chuk_conf: {},
    app_nrf_conf: {},
    app_balance_conf: {},
    app_pas_conf: {},
    imu_conf: {},
  };

  response.signature = payload.readInt32();
  response.controller_id = payload.readInt8();
  response.timeout_msec = payload.readInt32();
  response.timeout_brake_current = payload.readDouble32(1e0);
  response.send_can_status = payload.readInt8();
  response.send_can_status_rate_hz = payload.readUInt16();
  response.can_baud_rate = payload.readInt8();
  response.pairing_done = payload.readInt8();
  response.permanent_uart_enabled = payload.readInt8();
  response.shutdown_mode = payload.readInt8();
  response.can_mode = payload.readInt8();
  response.uavcan_esc_index = payload.readInt8();
  response.uavcan_raw_mode = payload.readInt8();
  response.app_to_use = payload.readInt8();
  response.app_ppm_conf.ctrl_type = payload.readInt8();
  response.app_ppm_conf.pid_max_erpm = payload.readDouble32(1e2);
  response.app_ppm_conf.hyst = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_start = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_end = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_center = payload.readDouble32(1e4);
  response.app_ppm_conf.median_filter = payload.readInt8();
  response.app_ppm_conf.safe_start = payload.readInt8();
  response.app_ppm_conf.throttle_exp = payload.readDouble32();
  response.app_ppm_conf.throttle_exp_brake = payload.readDouble32();
  response.app_ppm_conf.throttle_exp_mode = payload.readInt8();
  response.app_ppm_conf.ramp_time_pos = payload.readDouble32();
  response.app_ppm_conf.ramp_time_neg = payload.readDouble32();
  response.app_ppm_conf.multi_esc = payload.readInt8();
  response.app_ppm_conf.tc = payload.readInt8();
  response.app_ppm_conf.tc_max_diff = payload.readDouble32();
  response.app_ppm_conf.max_erpm_for_dir = payload.readDouble32();
  response.app_ppm_conf.smart_rev_max_duty = payload.readDouble32();
  response.app_ppm_conf.smart_rev_ramp_time = payload.readDouble32();
  response.app_adc_conf.hyst = payload.readDouble32();
  response.app_adc_conf.voltage_start = payload.readDouble32();
  response.app_adc_conf.voltage_end = payload.readDouble32();
  response.app_adc_conf.voltage_center = payload.readDouble32();
  response.app_adc_conf.voltage2_start = payload.readDouble32();
  response.app_adc_conf.voltage2_end = payload.readDouble32();
  response.app_adc_conf.use_filter = payload.readInt8();
  response.app_adc_conf.safe_start = payload.readInt8();
  response.app_adc_conf.cc_button_inverted = payload.readInt8();
  response.app_adc_conf.rev_button_inverted = payload.readInt8();
  response.app_adc_conf.voltage_inverted = payload.readInt8();
  response.app_adc_conf.voltage2_inverted = payload.readInt8();
  response.app_adc_conf.throttle_exp = payload.readDouble32();
  response.app_adc_conf.throttle_exp_brake = payload.readDouble32();

  return Promise.resolve(response);
}

/* eslint-disable no-eval */
export function useless() {
  /*

  buffer[ind++] = conf->app_adc_conf.throttle_exp_mode;
  buffer_append_float32_auto(buffer, conf->app_adc_conf.ramp_time_pos, &ind);
  buffer_append_float32_auto(buffer, conf->app_adc_conf.ramp_time_neg, &ind);
  buffer[ind++] = conf->app_adc_conf.multi_esc;
  buffer[ind++] = conf->app_adc_conf.tc;
  buffer_append_float32_auto(buffer, conf->app_adc_conf.tc_max_diff, &ind);
  buffer_append_uint16(buffer, conf->app_adc_conf.update_rate_hz, &ind);
  buffer_append_uint32(buffer, conf->app_uart_baudrate, &ind);
  buffer[ind++] = conf->app_chuk_conf.ctrl_type;
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.hyst, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.ramp_time_pos, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.ramp_time_neg, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.stick_erpm_per_s_in_cc, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.throttle_exp, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.throttle_exp_brake, &ind);
  buffer[ind++] = conf->app_chuk_conf.throttle_exp_mode;
  buffer[ind++] = conf->app_chuk_conf.multi_esc;
  buffer[ind++] = conf->app_chuk_conf.tc;
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.tc_max_diff, &ind);
  buffer[ind++] = conf->app_chuk_conf.use_smart_rev;
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.smart_rev_max_duty, &ind);
  buffer_append_float32_auto(buffer, conf->app_chuk_conf.smart_rev_ramp_time, &ind);
  buffer[ind++] = conf->app_nrf_conf.speed;
  buffer[ind++] = conf->app_nrf_conf.power;
  buffer[ind++] = conf->app_nrf_conf.crc_type;
  buffer[ind++] = conf->app_nrf_conf.retry_delay;
  buffer[ind++] = (uint8_t)conf->app_nrf_conf.retries;
  buffer[ind++] = (uint8_t)conf->app_nrf_conf.channel;
  buffer[ind++] = (uint8_t)conf->app_nrf_conf.address[0];
  buffer[ind++] = (uint8_t)conf->app_nrf_conf.address[1];
  buffer[ind++] = (uint8_t)conf->app_nrf_conf.address[2];
  buffer[ind++] = conf->app_nrf_conf.send_crc_ack;
  buffer_append_float32_auto(buffer, conf->app_balance_conf.kp, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.ki, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.kd, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.hertz, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.fault_pitch, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.fault_roll, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.fault_duty, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.fault_adc1, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.fault_adc2, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_delay_pitch, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_delay_roll, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_delay_duty, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_delay_switch_half, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_delay_switch_full, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.fault_adc_half_erpm, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_angle, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_speed, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_duty, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_high_voltage, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_low_voltage, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.tiltback_constant, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.tiltback_constant_erpm, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.startup_pitch_tolerance, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.startup_roll_tolerance, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.startup_speed, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.deadzone, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.current_boost, &ind);
  buffer[ind++] = conf->app_balance_conf.multi_esc;
  buffer_append_float32_auto(buffer, conf->app_balance_conf.yaw_kp, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.yaw_ki, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.yaw_kd, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.roll_steer_kp, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.roll_steer_erpm_kp, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.brake_current, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.yaw_current_clamp, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.setpoint_pitch_filter, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.setpoint_target_filter, &ind);
  buffer_append_float32_auto(buffer, conf->app_balance_conf.setpoint_filter_clamp, &ind);
  buffer_append_uint16(buffer, conf->app_balance_conf.kd_pt1_frequency, &ind);
  buffer[ind++] = conf->app_pas_conf.ctrl_type;
  buffer[ind++] = conf->app_pas_conf.sensor_type;
  buffer_append_float16(buffer, conf->app_pas_conf.current_scaling, 1000, &ind);
  buffer_append_float16(buffer, conf->app_pas_conf.pedal_rpm_start, 10, &ind);
  buffer_append_float16(buffer, conf->app_pas_conf.pedal_rpm_end, 10, &ind);
  buffer[ind++] = conf->app_pas_conf.invert_pedal_direction;
  buffer_append_uint16(buffer, conf->app_pas_conf.magnets, &ind);
  buffer[ind++] = conf->app_pas_conf.use_filter;
  buffer_append_float16(buffer, conf->app_pas_conf.ramp_time_pos, 100, &ind);
  buffer_append_float16(buffer, conf->app_pas_conf.ramp_time_neg, 100, &ind);
  buffer_append_uint16(buffer, conf->app_pas_conf.update_rate_hz, &ind);
  buffer[ind++] = conf->imu_conf.type;
  buffer[ind++] = conf->imu_conf.mode;
  buffer_append_uint16(buffer, conf->imu_conf.sample_rate_hz, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.accel_confidence_decay, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.mahony_kp, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.mahony_ki, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.madgwick_beta, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.rot_roll, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.rot_pitch, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.rot_yaw, &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.accel_offsets[0], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.accel_offsets[1], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.accel_offsets[2], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offsets[0], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offsets[1], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offsets[2], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offset_comp_fact[0], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offset_comp_fact[1], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offset_comp_fact[2], &ind);
  buffer_append_float32_auto(buffer, conf->imu_conf.gyro_offset_comp_clamp, &ind);
  */
}
