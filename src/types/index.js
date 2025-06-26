export const PropertyType = {
  Monitor: 'monitor',
  Keyboard: 'keyboard',
  Mouse: 'mouse',
  Fan: 'fan',
  Light: 'light',
  Router: 'wifi-router',
  AC: 'ac',
  Projector: 'projector',
  Printer: 'printer',
  Scanner: 'scanner',
  Speaker: 'speaker',
  Microphone: 'microphone',
  CPU: 'cpu',
  Laptop: 'laptop',
  UPS: 'ups',
  Switch: 'network-switch',
  Whiteboard: 'whiteboard',
  SmartBoard: 'smartboard',
  Podium: 'podium',
  CCTV: 'cctv',
  BiometricScanner: 'biometric-scanner',
  FireExtinguisher: 'fire-extinguisher',
  WaterCooler: 'water-cooler',
  Inverter: 'inverter',
  Television: 'tv',
  Desk: 'desk',
  Chair: 'chair',
  Cabinet: 'cabinet',
  FanCeiling: 'ceiling-fan',
  FanWall: 'wall-fan',
  TubeLight: 'tube-light',
  LEDLight: 'led-light',
  AirPurifier: 'air-purifier',
  ExtensionBox: 'extension-box',
  PowerStrip: 'power-strip',
  NetworkCable: 'network-cable',
  HDMI: 'hdmi-cable',
  VGA: 'vga-cable',
  MousePad: 'mouse-pad',
  RemoteControl: 'remote-control',
  AlarmSystem: 'alarm-system',
  AccessPoint: 'access-point',
};


// Property status as constants
export const PropertyStatus = {
  Working: 'working',
  NotWorking: 'not_working'
};

/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} type
 * @property {string} brand
 * @property {string} model
 * @property {typeof PropertyStatus[keyof typeof PropertyStatus]} status
 * @property {string} [purchaseDate]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Room
 * @property {number} id
 * @property {string} name
 * @property {Property[]} properties
 */

/**
 * @typedef {Object} Hall
 * @property {number} id
 * @property {string} name
 * @property {Room[]} rooms
 */

/**
 * @typedef {Object} Floor
 * @property {number} id
 * @property {string} name
 * @property {Hall[]} halls
 */

/**
 * @typedef {Object} Building
 * @property {Floor[]} floors
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'admin' | 'user'} role
 */

/**
 * @typedef {Object} PropertyStatusSummary
 * @property {string} type
 * @property {number} working
 * @property {number} notWorking
 * @property {number} total
 */

/**
 * @typedef {Object} LocationSummary
 * @property {string} name
 * @property {number} count
 * @property {number} working
 * @property {number} notWorking
 */