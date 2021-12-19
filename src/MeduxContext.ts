/*
 * @Author: Xavier Yin
 * @Date: 2021-10-23 03:27:26
 */
import React, { useContext } from 'react';

// As default context for medux
const MeduxContext: ReactMedux.MeduxContext = React.createContext({});

// A shortcut for calling useContext
const useMeduxContext = (Context?: ReactMedux.MeduxContext) =>
  useContext(Context || MeduxContext);

export { useMeduxContext };

export default MeduxContext;
