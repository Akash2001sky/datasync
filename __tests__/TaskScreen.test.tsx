/**
 * @format
 */

import 'react-native';
import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import TaskScreen from '../components/taskDataScreen/TaskScreen';

jest.mock('@react-native-community/netinfo', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    fetch: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({isConnected: true}))
      .mockImplementation(() => Promise.resolve({isConnected: false})),
    addListener: jest.fn(),
    useNetInfo: jest.fn(() => ({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
      details: {
        isConnectionExpensive: false,
      },
    })),
  };
});

jest.mock('@realm/react', () => {
  return {
    useRealm: jest.fn(() => ({
      write: jest.fn(callback => callback()),
      create: jest.fn((type, value) => ({
        ...value,
        _id: value._id || new (require('@realm/react').Realm.BSON.ObjectId)(),
      })),
      delete: jest.fn(),
    })),
    useQuery: jest.fn(() => ({
      sorted: jest.fn(() => [
        {
          _id: {
            toHexString: jest.fn(() => 'mockObjectId'),
          },
          description: 'Test Task',
          createdAt: new Date(),
          isComplete: false,
        },
      ]),
    })),
    RealmProvider: ({children}) => <>{children}</>,
    Realm: {
      Object: jest.fn(),
      BSON: {
        ObjectId: jest.fn(() => {
          const objectId = {
            toHexString: jest.fn(() => 'mockObjectId'),
          };
          return objectId;
        }),
      },
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
    jest.useFakeTimers();
    render(<TaskScreen />);
    jest.runAllTimers();
  });
  test('user should be able enter in the input and click on add button', () => {
    const {getByTestId} = render(<TaskScreen />);
    const input = getByTestId('input_box');
    fireEvent.changeText(input, 'update to manager');

    const addButton = getByTestId('addAndUpdateBtn');
    fireEvent.press(addButton);

    const mockItem = {
      _id: '1',
      description: 'update to manager',
      isComplete: false,
      createdAt: '1723051249771',
    };
    const flatList = getByTestId('taskList');
    const flatRender = render(flatList.props.renderItem({item: mockItem}));
    expect(flatList.props.data).toHaveLength(1);
  });
  test('user renders the task list to update data', async () => {
    const {getByTestId} = render(<TaskScreen />);
    const mockItem = {
      _id: '1',
      description: 'update to manager',
      isComplete: false,
      createdAt: '1723051249771',
    };
    const flatList = getByTestId('taskList');
    const flatRender = render(flatList.props.renderItem({item: mockItem}));
    const {getByTestId: listTestId} = flatRender;
    const editButton = listTestId('EditBtn');
    fireEvent.press(editButton);
    const input = getByTestId('input_box');
    fireEvent.changeText(input, 'update to techlead');
    const updateButton = getByTestId('addAndUpdateBtn');
    fireEvent.press(updateButton);
    const mockItem1 = {
      _id: '1',
      description: 'update to techlead',
      isComplete: false,
      createdAt: '1723051249771',
    };
    const taskList = getByTestId('taskList');
    const taskListRender = render(flatList.props.renderItem({item: mockItem1}));
    expect(taskList.props.data).toHaveLength(1);
  });
  test('user trys to delete the task', async () => {
    const {getByTestId} = render(<TaskScreen />);
    const mockItem = {
      _id: '1',
      description: 'update to manager',
      isComplete: false,
      createdAt: '1723051249771',
    };
    const flatList = getByTestId('taskList');
    const flatRender = render(flatList.props.renderItem({item: mockItem}));
    const {getByTestId: listTestId} = flatRender;
    const deleteButton = listTestId('DeleteBtn');
    fireEvent.press(deleteButton);

    const mockItem1 = {
      _id: '1',
      description: 'update to techlead',
      isComplete: true,
      createdAt: '1723051249771',
    };
    const taskList = getByTestId('taskList');
    const taskListRender = render(flatList.props.renderItem({item: mockItem1}));
    expect(taskList.props.data).toHaveLength(1);
  });
});
