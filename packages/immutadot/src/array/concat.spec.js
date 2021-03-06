/* eslint-env jest */
import { concat } from 'array'
import { immutaTest } from 'test.utils'

describe('array.concat', () => {

  it('should concat an array', () => {
    immutaTest((input, path) => {
      const output = concat(input, path, [3, 4])
      expect(output).toEqual({
        nested: { prop: [1, 2, 3, 4] },
        other: {},
      })
      return output
    }, {
      nested: { prop: [1, 2] },
      other: {},
    }, 'nested.prop')
  })

  it('should add several arrays', () => {
    immutaTest((input, path) => {
      const output = concat(input, path, [3, 4], [5, 6])
      expect(output).toEqual({
        nested: { prop: [1, 2, 3, 4, 5, 6] },
        other: {},
      })
      return output
    }, {
      nested: { prop: [1, 2] },
      other: {},
    }, 'nested.prop')
  })

  it('should replace value with array', () => {
    immutaTest((input, path) => {
      const output = concat(input, path, [2, 3])
      expect(output).toEqual({
        nested: { prop: [1, 2, 3] },
        other: {},
      })
      return output
    }, {
      nested: { prop: 1 },
      other: {},
    }, 'nested.prop')
  })
})
