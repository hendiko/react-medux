/// <refer
/*
 * @Author: Xavier Yin
 * @Date: 2021-11-23 22:21:15
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2021-11-24 00:17:03
 */
import { useState, useMemo, useReducer, useRef, useCallback } from 'react';
import { storeReducer, loadingReducer } from './reducer';
import { isPlainObject, isFunction, loget, loset, isThenable } from './utils';
import ReactMedux from './types/useMeduxStore.d';

// ---------------------------------------------------------------------

/** LoadingReducer 的初始化函数 */
const initLoadingReducerState = (names: string[]) =>
  names.reduce((state, name) => {
    // 默认初始化所有加载状态都是为否
    state[name] = false;
    return state;
  }, {});

/**
 * The hook being similar to useReducer which is provided by React can be
 * multiple and independent stores that manage states for react components.
 */
function useMeduxStore(
  reducers?: StoreReducers,
  initialState?: StoreState,
  init?: StoreInit,
) {
  const [[storeReducers, storeInitialState, storeInit]]: [
    MeduxStorePropsTuple,
  ] = useState<MeduxStorePropsTuple>([
    { ...reducers },
    isPlainObject(initialState) ? initialState : {},
    init,
  ]);

  // 备份初始化状态值
  const [initialStateBackup] = useState<StoreState>({
    ...initialState,
  });

  // the array of names that come from the given reducer functions.
  const storeReducerNames: string[] = useMemo(
    () => Object.keys(storeReducers),
    [storeReducers],
  );

  const [storeState, storeDispatch] = useReducer(
    storeReducer,
    storeInitialState,
    storeInit,
  );

  // 维护所有 core reducer 执行状态
  const [loadingState, loadingDispatch] = useReducer(
    loadingReducer,
    storeReducerNames,
    initLoadingReducerState,
  );

  const counter: { [key: string]: number } = useMemo(
    () =>
      storeReducerNames.reduce((state, name) => {
        state[name] = 0;
        return state;
      }, {}),
    [storeReducerNames],
  );

  const counterRef = useRef(counter);
  const dispatchRef = useRef<Dispatch>();
  const loadingStateRef = useRef(loadingState);
  const storeStateRef = useRef<StoreState>(storeState);

  storeStateRef.current = storeState;

  const operations: Operations = useMemo(() => {
    // 只允许对 plain object 进行操作
    const merge = (payload: PayloadObject) => {
      if (isPlainObject(payload)) storeDispatch({ type: 'merge', paylod });
    };

    const reset = (payload: PayloadObject) => {
      if (isPlainObject(payload)) {
        storeDispatch({ type: 'reset', payload });
      } else {
        payload = isFunction(storeInit)
          ? storeInit(initialStateBackup)
          : initialStateBackup;

        storeDispatch({
          type: 'reset',
          payload: isPlainObject(payload) ? { ...payload } : {},
        });
      }
    };

    const clear = () => storeDispatch({ type: 'clear' });

    // 支持直接 set 一个 Plain Object（等同于 merge 操作）或者按路 namePath 设置 value
    const set = (namePath: PayloadObject | NamePath, value?: any) => {
      // if namePath is a PayloadObject
      if (isPlainObject(namePath)) {
        merge(namePath);
      } else {
        // when the namePath is a NamePath
        storeDispatch({
          type: 'merge',
          payload: loset({ ...storeStateRef.current }, namePath, value),
        });
      }
    };

    const get = (namePath: NamePath, defaultValue?: any) =>
      loget(storeStateRef.current, namePath, defaultValue);

    const call = (...args) => dispatchRef.current(...args);

    return { merge, reset, clear, set, get, call };
  }, [storeDispatch, storeInit, initialStateBackup]);

  // 更新 store 的 reduce 函数执行状态
  const updateLoadingState = useCallback(
    (act, storeReduceName) => {
      if (act === '+') counterRef.current[storeReduceName] += 1;
      if (act === '-') counterRef.current[storeReduceName] -= 1;
      loadingDispatch({
        type: 'change',
        name: storeReduceName,
        count: counterRef.current[storeReduceName],
      });
    },
    [loadingDispatch],
  );

  const handleAction = useCallback(
    (action: Action) => {
      const { type } = action;
      const reduce = <StoreReducer>storeReducers?.[type];
      // 如果不存在 action 中指定的 reduce 函数，则直接退出
      if (!isFunction(reduce)) return;

      const result = reduce(storeStateRef.current, action, {
        ...operations,
        loading: loadingStateRef.current,
      });

      const isPromiseResult = isThenable(result);

      if (isPromiseResult) {
        updateLoadingState('+', type);
        Promise.resolve(result).then(
          () => {
            updateLoadingState('-', type);
          },
          () => {
            updateLoadingState('-', type);
          },
        );
      }

      // 如果此次 action 是一个 get 函数，则直接返回结果。
      // 如果此次 action 是非 get 函数，则需要将结果更新到 store

      // 以 get 开头的驼峰命名为 get 函数，例如 getName 是 get 函数，但 getname 不是。
      if (/^get[A-Z]/.test(type)) {
        // eslint-disable-next-line consistent-return
        return /Async$/.test(type) ? Promise.resolve(result) : result;
      }

      // 非 get 函数，更新 store
      if (isPromiseResult) {
        Promise.resolve(result).then(
          (value: any) => operations.merge(value),
          () => null,
        );
      } else {
        operations.merge(result);
      }
    },
    [storeReducers, updateLoadingState, operations],
  );

  const dispatch: Dispatch = useMemo(() => {
    const fn = (action, payload, ...args) => {
      // 传入 action 为对象时，直接触发 dispatch
      if (isPlainObject(action)) return handleAction(action);

      // 如果 action 为字符串，第一个参数作为 type，第二个参数作为 payload 传入 dispatch
      if (typeof action === 'string')
        return handleAction({ type: action, payload });

      // 如果 action 是一个函数，则该函数将接受 (storeState, dispatch, payload, ...args) 参数
      if (isFunction(action)) {
        const result = action(storeStateRef.current, fn, payload, ...args);
        if (isThenable(result)) {
          return Promise.resolve(result).then((value: any) => fn(value));
        }
        return fn(result);
      }
      return undefined;
    };

    // 添加 reducers 的 type 作为 dispatch 方法名，以便快速调用。
    // 例如：reducers = {getName(state, action) {}}
    // 你可以 dispatch({type: 'getName', name}) 或者 dispatch.getName({name});
    storeReducerNames.forEach((name: string) => {
      // 只能接受对象格式的 action，action 中可以不用指定 type，即使指定了 type 也是无效的。
      fn[name] = (action) => fn({ ...action, type: name });
    });

    // 获取 store state 值的方法
    fn.getState = (namePath, defaultValue) => {
      const { current: store } = storeStateRef;
      // 如果不传任何路径，则返回当前完整的 storeState。
      return namePath === undefined
        ? store
        : loget(store, namePath, defaultValue);
    };

    // 批量获取 store state 值，返回数组
    fn.getStates = (...namePaths: NamePath[]) =>
      namePaths.map((namePath) => operations.get(namePath));

    // 直接更新 store
    // [警告]设置 state，小心使用(所有的 state 变化应该通过 reducer 来更新)
    fn.setState = (
      namePath: ReactMedux.PayloadObject | ReactMedux.NamePath,
      value?: any,
    ) => {
      // 设置
      operations.set(namePath, value);
    };

    return fn;
  }, [storeReducerNames, handleAction, operations]);

  dispatchRef.current = dispatch;

  const store: MeduxStore = useMemo(
    () => ({
      dispatch,
      loading: loadingState,
      operations,
      state: storeState,
    }),
    [dispatch, loadingState, operations, storeState],
  );

  return [store];
}

export default useMeduxStore;
