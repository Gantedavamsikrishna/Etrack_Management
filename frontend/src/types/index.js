// Property types as constants
export const PropertyType = {
  Monitor: 'monitor',
  Keyboard: 'keyboard',
  Mouse: 'mouse',
  Fan: 'fan',
  Light: 'light',
  Router: 'wifi-router',
  AC: 'ac'
};

/**
 * @typedef {'working' | 'not_working'} PropertyStatus
 */

/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} type
 * @property {string} brand
 * @property {string} model
 * @property {PropertyStatus} status
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
