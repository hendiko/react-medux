/*
 * @Author: Xavier Yin
 * @Date: 2021-12-05 01:23:20
 */

import { ReducerAction } from 'react';

declare global {
  declare interface MeduxAction extends ReducerAction {
    type: string;
    payload?: { [key?: string]: any };
    [key?: string]: any;
  }

  // payload for reducer
  declare interface PayloadObject {
    [key: string]: any;
  }

  declare interface StoreState {
    [key?: string]: any;
  }

  declare interface Operations {
    merge: (payload: PayloadObject) => void;
    reset: function;
    clear: function;
    set: function;
    get: function;
    call: function;
  }

  declare interface StoreReducer {
    (state: StoreState, action: MeduxAction, operations: Operations):
      | StoreState
      | any;
  }

  declare interface StoreReducers {
    [key?: string]: StoreReducer;
  }

  declare interface StoreInit {
    <T extends StoreState>(initialState: T): StoreState;
  }

  declare type MeduxStorePropsTuple = [StoreReducers?, StoreState?, StoreInit?];

  declare type NamePath = string | string[];

  declare interface Dispatch {
    (
      action: MeduxAction | string | function,
      payload?: PayloadObject,
      ...args: any[]
    ): any;

    // get state from storeState
    getState: (
      namePath: string | string[],
      defaultValue?: any,
    ) => StoreState | any;

    getStates: (...namePaths: NamePath[]) => any[];

    setState: (namePath: PayloadObject | NamePath, value?: any) => void;

    [key: string]: (action: Omit<MeduxAction, 'type'>) => any;
  }

  declare interface Thenable {
    then: (value) => any;
  }

  // the state of excution of calling dispatch static method
  declare interface LoadingState {
    [dispatchMethodName: string]: boolean;
  }

  // the first element of result returned by useMeduxStore hook
  declare interface MeduxStore {
    dispatch: Dispatch;
    loading: LoadingState;
    operation: Operations;
    state: StoreState;
  }
}

export default ReactMedux;
