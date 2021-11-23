/*
 * @Author: Xavier Yin
 * @Date: 2021-11-24 09:19:15
 */
import React from 'react';
import type { Context } from 'react';
import Medux, { connect, createMedux } from './Medux';
import MeduxContext, { useMeduxContext } from './MeduxContext';
import useMeduxStore from './useMeduxStore';

type WithMeduxOptions = { context?: Context };

// 返回已绑定上下文的方法
const withMedux = (options: WithMeduxOptions) => {
  const { context = React.createContext({}) } = options || {};

  const _connect = (
    mapStateToProps,
    mapDispatchToProps,
    mapLoadingToProps,
    options,
  ) =>
    connect(mapStateToProps, mapDispatchToProps, mapLoadingToProps, {
      ...options,
      context,
    });

  const _createMedux = (reducers, initialState, init, options) =>
    createMedux(reducers, initialState, init, { ...options, context });

  const _useMeduxContext = () => useMeduxContext(context);

  return {
    connect: _connect,
    context,
    createMedux: _createMedux,
    useMeduxContext: _useMeduxContext,
  };
};

export {
  Medux,
  MeduxContext,
  connect,
  createMedux,
  useMeduxContext,
  useMeduxStore,
  withMedux,
};
