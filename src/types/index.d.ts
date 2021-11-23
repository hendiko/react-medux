/*
 * @Author: Xavier Yin
 * @Date: 2021-10-23 03:29:31
 */

import { Context } from 'react';
import { MeduxReducer, MeduxLoadingReducer } from './reducers.d';
import * as medux from './medux.d';

declare namespace ReactMedux {
  type Reducer = MeduxReducer;
  type LoadingReducer = MeduxLoadingReducer;

  type TransformToEntries = medux.TransformToEntries;

  type MeduxContext = Context;

  type MeduxProps = {
    context: Context | MeduxContext;
  };
}

export default ReactMedux;
