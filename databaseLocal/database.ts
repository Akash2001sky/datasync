import {Alert} from 'react-native';
import {Results} from 'realm';
import {Realm} from '@realm/react';
import Task from './realm';
const configJSON = require('./config');

export const filterTasks = async (tasks: Results<Task>, realm: Realm) => {
  let syncTasks = tasks.filtered('isComplete == false');
  for (let item of syncTasks) {
    try {
      const body = JSON.stringify({
        id: item._id.toHexString(),
        description: item.description,
      });
      const response = await fetch(configJSON.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        realm.write(() => {
          item.isComplete = true;
        });
      } else {
        Alert.alert(
          configJSON.failureStatusError,
          JSON.stringify(response.status),
        );
      }
    } catch (error) {
      Alert.alert(configJSON.failureStatusError, JSON.stringify(error));
    }
  }
};
