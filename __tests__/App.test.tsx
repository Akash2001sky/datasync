/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import {render} from '@testing-library/react-native';

jest.mock('@react-native-community/netinfo', () => {
  return {
    addEventListener: jest.fn(CB => CB({isConnected: true})),
  };
});

jest.mock('@realm/react', () => {
  const mockRealmProvider = ({
    children,
    schema,
    schemaVersion,
    onMigration,
  }) => {
    const mockOldRealm = {
      schemaVersion: 2,
      objects: jest.fn(name => {
        if (name === 'Task') {
          return [{isComplete: true}, {isComplete: true}];
        }
        return [];
      }),
    };

    const mockNewRealm = {
      schemaVersion: 3,
      objects: jest.fn(name => {
        if (name === 'Task') {
          return [{isComplete: true}, {isComplete: true}];
        }
        return [];
      }),
    };

    if (onMigration) {
      onMigration(mockOldRealm, mockNewRealm);
      onMigration(mockNewRealm);
    }

    return <>{children}</>;
  };

  return {
    RealmProvider: mockRealmProvider,
    useRealm: jest.fn(() => ({})),
    useQuery: jest.fn(() => ({
      sorted: jest.fn(),
    })),
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
describe('Task Screen Component', () => {
  test('renders correctly', () => {
    const app = render(<App />);
    expect(app).toBeDefined();
  });
});
