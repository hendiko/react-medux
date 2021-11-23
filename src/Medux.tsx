/*
 * @Author: Xavier Yin
 * @Date: 2021-11-24 11:27:23
 */
import React, { useMemo, Context } from 'react';
import MeduxContext, { useMeduxContext } from './MeduxContext';
import { isString, isFunction, isPlainObject, isArray } from './utils';
import useMeduxStore from './useMeduxStore';
import ReactMedux from './types/index.d';

const transformToEntriesOrFunc: ReactMedux.TransformToEntries = (obj) => {
  if (isPlainObject(obj)) return Object.entries(obj);

  if (isFunction(obj)) return obj;

  // 仅支持 Array<string> 类型的数据
  if (isArray(obj))
    return obj.reduce((arr, item) => {
      if (isString(item)) arr.push([item, item]);
      return arr;
    }, []);

  if (isString(obj)) return [obj, obj];

  return null;
};

const validProps = (obj) => (isPlainObject(obj) ? obj : {});

type MeduxProps = {
  context: Context | MeduxContext;
  children: React.ReactNode;
  store: MeduxStore;
};

const Medux = React.memo((props: MeduxProps) => {
  const { store, context = MeduxContext, children } = props;
  return <context.Provider value={store}>{children}</context.Provider>;
});

Medux.displayName = 'Medux';

const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mapLoadingToProps,
  options,
) => {
  // 支持 map 参数是字符串、字符串数组、对象、函数
  mapStateToProps = transformToEntriesOrFunc(mapStateToProps);
  mapDispatchToProps = transformToEntriesOrFunc(mapDispatchToProps);
  mapLoadingToProps = transformToEntriesOrFunc(mapLoadingToProps);

  return (Comp) => {
    const MemoedComp = React.memo(Comp);

    return React.memo((props) => {
      const { context } = options || {};
      const { state, dispatch, loading } = useMeduxContext(context) || {};

      const propsFromState = useMemo(() => {
        if (isFunction(mapStateToProps)) {
          return validProps(mapStateToProps(state, props, { state, dispatch }));
        }

        if (isArray(mapStateToProps)) {
          return mapStateToProps.reduce((acc, [key, path]) => {
            acc[key] = dispatch.getState(path);
            return acc;
          }, {});
        }

        return {};
      }, [state, dispatch, props]);

      const propsFromDispatch = useMemo(() => {
        if (isFunction(mapDispatchToProps)) {
          return validProps(
            mapDispatchToProps(dispatch, props, { state, dispatch }),
          );
        }

        if (isArray(mapDispatchToProps)) {
          return mapDispatchToProps.reduce((acc, [key, name]) => {
            acc[key] = dispatch[name];
            return acc;
          }, {});
        }

        return {};
      }, [state, dispatch, props]);

      const propsFromLoading = useMemo(() => {
        if (isFunction(mapLoadingToProps)) {
          return validProps(mapLoadingToProps(loading, props));
        }

        if (isArray(mapLoadingToProps)) {
          return mapLoadingToProps.reduce((acc, [key, name]) => {
            acc[key] = isArray(name)
              ? name.reduce((bool, item) => bool || loading[item], false)
              : loading[name];
            return acc;
          }, {});
        }

        return {};
      }, [loading, props]);

      return (
        <MemoedComp
          {...props}
          {...propsFromState}
          {...propsFromDispatch}
          {...propsFromLoading}
        ></MemoedComp>
      );
    });
  };
};

const createMedux = (reducers, initialState, init, options) => (Comp) =>
  React.memo((props) => {
    const { context = MeduxContext } = options || {};
    const [store] = useMeduxStore(reducers, initialState, init);

    return (
      <Medux store={store} context={context}>
        <Comp {...props}></Comp>
      </Medux>
    );
  });

export default Medux;

export { connect, createMedux };
