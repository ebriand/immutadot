import { convert } from 'core/convert'

/**
 * Applies <code>!</code> to the property.
 * @function
 * @memberof lang
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @return {Object} Returns the updated object.
 * @example toggle({ nested: { prop: true } }, 'nested.prop') // { nested: { prop: false } }
 * @since 0.1.5
 */
const toggle = convert(v => !v)

export { toggle }
