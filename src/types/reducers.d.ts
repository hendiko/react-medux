/*
 * @Author: Xavier Yin
 * @Date: 2021-12-05 13:49:55
 */

import { ReducerAction } from 'react';

export interface MeduxReducerAction extends ReducerAction {
  type: string;
  payload: { [k: string]: any };
}

export interface MeduxReducer {
  <S, A extends MeduxReducerAction>(prevState: S, action: A): S;
}

export interface MeduxLoadingReducer {
  <
    S extends { [k: string]: boolean },
    A extends { type: string; name: string; count: number },
  >(
    prevState: S,
    action: A,
  ): S;
}
