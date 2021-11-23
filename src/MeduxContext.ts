/*
 * @Author: Xavier Yin
 * @Date: 2021-10-23 03:27:26
 */
import React, { useContext, Context } from 'react';

// As default context for medux
const MeduxContext: Context = React.createContext({});

// A shortcut for calling useContext
const useMeduxContext = (Context?: Context) =>
  useContext(Context || MeduxContext);

export default MeduxContext;

export { useMeduxContext };
