/**
 * @format
 */

import 'react-native';
import React from 'react';

import {render} from '@testing-library/react-native';
import NoInternetConnection from '../components/internetConnectivity/NoInternetConnection';
import netInfo from '@react-native-community/netinfo';
jest.mock('@react-native-community/netinfo', () => {
  return {
    addEventListener: jest.fn(CB => CB({isConnected: true})),
  };
});
jest.mock('@realm/react', () => {
  return {
    useRealm: jest.fn(() => ({})),
    useQuery: jest.fn(() => ({
      sorted: jest.fn(),
    })),
    RealmProvider: ({children}) => <>{children}</>,
    Realm: {
      Object: jest.fn(),
    },
  };
});
jest.mock('../databaseLocal/database', () => {
  return {
    filterTasks: jest.fn(),
  };
});
let mockTimeout: Function;
beforeEach(() => {
  jest.spyOn(global, 'setTimeout').mockImplementation((cb: Function) => {
    mockTimeout = cb;
    return 1 as unknown as ReturnType<typeof setTimeout>;
  });
});
it('renders correctly', () => {
  jest.spyOn(netInfo, 'addEventListener').mockImplementation((cb: Function) => {
    return cb({isConnected: true});
  });
  render(<NoInternetConnection />);
  mockTimeout();
});

it('renders correctly', () => {
  jest.spyOn(netInfo, 'addEventListener').mockImplementation((cb: Function) => {
    return cb({isConnected: false});
  });
  render(<NoInternetConnection />);
  jest.runAllTimers();
});
