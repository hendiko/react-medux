/*
 * @Author: Xavier Yin
 * @Date: 2021-10-23 03:29:31
 */

import React, { Context, ReducerState, Reducer } from 'react';

declare global {
  declare namespace ReactMedux {
    /** Plain Object */
    type PO = { [key: string]: any };

    type MeduxState = ReducerState<Reducer<PO, any>>;

    /** The type of payload prop in action passed into Medux reducer function */
    type MeduxActionPayload = PO;

    /** The type of action passed into Medux reducer function */
    interface MeduxAction {
      type: string;
      payload?: MeduxActionPayload;
      [key: string]: any;
    }

    /** The path to get value from Medux store's state */
    type NamePath = string | string[];

    type ActionHandler = (action: MeduxAction) => any;

    /** The boolean that represents the loading status of MeduxDispatch's static method's execution. */
    type MeduxLoading = { [method: string]: boolean };

    type MeduxReactReducer = Reducer<MeduxState, MeduxAction>;

    interface MeduxLoadingReducer {
      (
        state: MeduxLoading,
        action: { type: string; name: string; count: number },
      ): MeduxLoading;
    }

    namespace MeduxDispatchMethods {
      type GetState = (namePath: NamePath, defaultValue?: any) => any;
      type GetStates = (...namePaths: NamePath[]) => Array<any>;

      interface SetState {
        (namePath: PO): void;
        (namePath: NamePath, value: any): void;
      }
    }

    interface MeduxDispatch {
      (action: PO): ReturnType<ActionHandler>;
      (action: string, payload: PO): ReturnType<ActionHandler>;
      (action: function, payload?: PO, ...args): any;

      getState: MeduxDispatchMethods.GetState;

      getStates: MeduxDispatchMethods.GetStates;

      setState: MeduxDispatchMethods.SetState;

      // eslint-disable-next-line no-use-before-define
      [key: string]: MeduxReducer;
    }

    // the props object that is passed into react component.
    type RCProps = { [name: string]: any };

    // the function to help create props from Medux state, dispatch or loading.
    type FuncToMapState = (
      state: MeduxState | undefined,
      props: RCProps | undefined,
      {
        state,
        dispatch,
      }: { state: MeduxState | undefined; dispatch: MeduxDispatch | undefined },
    ) => RCProps;

    type FuncToMapDispatch = (
      dispatch: MeduxDispatch | undefined,
      props: RCProps | undefined,
      {
        state,
        dispatch,
      }: { state: MeduxState | undefined; dispatch: MeduxDispatch | undefined },
    ) => RCProps;

    type FuncToMapLoading = (
      loading: MeduxLoading | undefined,
      props: RCProps | undefined,
    ) => RCProps;

    interface TransfromMapping {
      (
        mapping:
          | string
          | string[]
          | { [propName: string]: string }
          | { [propName: string]: NamePath },
      ): Array<[string, string]>;

      <T extends FuncToMapState | FuncToMapDispatch | FuncToMapLoading>(
        fn: T,
      ): T;

      (other: any): void;
    }

    type OperationCall = (...args) => ReturnType<MeduxDispatch>;
    type OperationClear = () => ReturnType<MeduxDispatch>;
    type OperationMerge = (payload: MeduxActionPayload) => void;
    type OperationGet = (namePath: NamePath, defaultValue?: any) => any;
    type OperationReset = (payload?: MeduxActionPayload) => void;
    interface OperationSet {
      (namePath: MeduxActionPayload): void;
      (namePath: NamePath, value: any): void;
    }

    interface MeduxActionOperations {
      call: OperationCall;
      clear: OperationClear;
      get: OperationGet;
      merge: OperationMerge;
      reset: OperationReset;
      set: OperationSet;
    }

    interface MeduxReducer extends Reducer {
      (
        state?: MeduxState,
        action?: MeduxAction,
        operations?: MeduxActionOperations & { loading: MeduxLoading },
      ): MeduxState | void;
    }

    interface MeduxReducers {
      [name: string]: MeduxReducer;
    }

    type MeduxReducerInitializer = (
      arg: MeduxState,
    ) => ReducerState<MeduxReactReducer>;

    /** The Medux store  */
    interface MeduxStore {
      dispatch: MeduxDispatch;
      loading: MeduxLoading;
      operations: MeduxActionOperations;
      state: MeduxState;
    }

    type MeduxContext = Context<Partial<MeduxStore>>;

    interface CreateMedux {
      (
        reducers?: MeduxReducers,
        initialState?: MeduxState,
        init?: MeduxReducerInitializer,
        options?: { context?: MeduxContext },
      ): (Comp: React.FC) => React.ReactNode;
    }

    type MapStateToProps = string | string[] | PO | FuncToMapState;
    type MapDispatchToProps = string | string[] | PO | FuncToMapDispatch;
    type MapLoadingToProps =
      | string
      | string[]
      | MeduxLoading
      | FuncToMapLoading;

    interface Connect {
      (
        mapStateToProps?: MapStateToProps,
        mapDispatchToProps?: MapDispatchToProps,
        mapLoadingToProps?: MapLoadingToProps,
        options?: { context?: MeduxContext },
      ): (Comp: React.FC) => React.ReactNode;
    }
  }
}

export default ReactMedux;
