/*
 * @Author: Xavier Yin
 * @Date: 2021-11-23 22:41:10
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2021-12-19 22:59:44
 */
import ReactMedux from './types/index.d';
import { isPlainObject } from './utils';

/** 核心 reduce 函数，实现状态的合并、重置、清空 */
const storeReducer: ReactMedux.MeduxReactReducer = (state, action) => {
  const { type, payload } = action || {};
  // support three types which specify how to change sotre states.
  if (type === 'merge')
    return state === payload ? state : { ...state, ...payload };
  if (type === 'reset')
    return (isPlainObject(payload) ? payload : {}) as ReactMedux.MeduxState;
  if (type === 'clear') return {};
  return state;
};

/** 更新异步 reduce 函数运行的 loading 状态 */
const loadingReducer: ReactMedux.MeduxLoadingReducer = (state, action) => {
  const { type, name, count } = action;

  if (type === 'change' && state[name] !== !!count) {
    return { ...state, [name]: !!count };
  }

  return state;
};

export { storeReducer, loadingReducer };
