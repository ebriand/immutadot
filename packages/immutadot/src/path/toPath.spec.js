/* eslint-env jest */
import {
  allProps,
  index,
  list,
  prop,
  slice,
} from './consts'

import { toPath } from './toPath'

describe('path.toPath', () => {

  it('should convert basic path', () => {
    expect(toPath('a.22.ccc')).toEqual([[prop, 'a'], [prop, '22'], [prop, 'ccc']])
    // Leading dot should be discarded
    expect(toPath('.a')).toEqual([[prop, 'a']])
    // Empty properties should be kept
    expect(toPath('.')).toEqual([[prop, '']])
    expect(toPath('..prop')).toEqual([[prop, ''], [prop, 'prop']])
    expect(toPath('.a.')).toEqual([[prop, 'a'], [prop, '']])
    expect(toPath('..')).toEqual([[prop, ''], [prop, '']])
    // If no separators, path should be interpreted as one property
    expect(toPath('\']"\\')).toEqual([[prop, '\']"\\']])
  })

  it('should convert array notation path', () => {
    expect(toPath('[0]["1.2"][\'[1.2]\']["[\\"1.2\\"]"][1a][1[2]')).toEqual([[index, 0], [prop, '1.2'], [prop, '[1.2]'], [prop, '["1.2"]'], [prop, '1a'], [prop, '1[2']])
    // Empty unterminated array notation should be discarded
    expect(toPath('[0][')).toEqual([[index, 0], [prop, '[']])
    expect(toPath('[0]["')).toEqual([[index, 0], [prop, '["']])
    // Unterminated array notation should run to end of path as string
    expect(toPath('[0][123')).toEqual([[index, 0], [prop, '[123']])
    expect(toPath('[0][1.a[2')).toEqual([[index, 0], [prop, '[1'], [prop, 'a'], [prop, '[2']])
    // Unterminated quoted array notation should run to end of path
    expect(toPath('[0]["1[2].a')).toEqual([[index, 0], [prop, '["1'], [index, 2], [prop, 'a']])
  })

  it('should convert slice notation path', () => {
    expect(toPath('[:][1:][:-2][3:4]')).toEqual([
      [slice, [0, undefined]],
      [slice, [1, undefined]],
      [slice, [0, -2]],
      [slice, [3, 4]],
    ])
    expect(toPath('[1:2:3][1:a][1:2')).toEqual([[prop, '1:2:3'], [prop, '1:a'], [prop, '[1:2']])
  })

  it('should convert list notation path', () => {
    expect(toPath('{abc,defg}.{123,4567,89}.{foo}')).toEqual([[list, ['abc', 'defg']], [list, ['123', '4567', '89']], [prop, 'foo']])
    expect(toPath('{"abc,defg",foo}.{\'123,4567,89\'}')).toEqual([[list, ['abc,defg', 'foo']], [prop, '123,4567,89']])
    expect(toPath('{,1,2,3}')).toEqual([[list, ['', '1', '2', '3']]])
    // Unterminated list notation should give a prop
    expect(toPath('abc.{')).toEqual([[prop, 'abc'], [prop, '{']])
    expect(toPath('abc.{"')).toEqual([[prop, 'abc'], [prop, '{"']])
    expect(toPath('abc.{a,b,c')).toEqual([[prop, 'abc'], [prop, '{a,b,c']])
    expect(toPath('{abc,defg[0].foo{bar')).toEqual([[prop, '{abc,defg'], [index, 0], [prop, 'foo'], [prop, '{bar']])
    // Unterminated quoted list notation should run to end of path
    expect(toPath('{abc,"defg[0]}.foo.{\'bar')).toEqual([[prop, '{abc,"defg'], [index, 0], [prop, '}'], [prop, 'foo'], [prop, '{\'bar']])
  })

  it('should convert list wildcard notation path', () => {
    expect(toPath('{*}')).toEqual([[allProps]])
  })

  it('should convert mixed path', () => {
    expect(toPath('a[0]["b.c"].666[1:].{1a,2b,3c}')).toEqual([[prop, 'a'], [index, 0], [prop, 'b.c'], [prop, '666'], [slice, [1, undefined]], [list, ['1a', '2b', '3c']]])
    expect(toPath('a.[0].["b.c"]666[1:2:3]{1a}{"2b",\'3c\'}')).toEqual([[prop, 'a'], [index, 0], [prop, 'b.c'], [prop, '666'], [prop, '1:2:3'], [prop, '1a'], [list, ['2b', '3c']]])
  })

  it('should give empty path for nil values', () => {
    expect(toPath(null)).toEqual([])
    expect(toPath(undefined)).toEqual([])
  })
})
