/*
 * @Author: Xavier Yin
 * @Date: 2021-10-23 03:20:50
 */

import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import loget from 'lodash/get';
import loset from 'lodash/set';

const isFunction = (fn: any): boolean => typeof fn === 'function';
const isString = (str: any): boolean => typeof str === 'string';
const isThenable = (thenable: any): boolean => isFunction(thenable?.then);

export {
  isArray,
  isFunction,
  isPlainObject,
  isString,
  isThenable,
  loget,
  loset,
};
