import {Alert} from 'react-native';
import {Results} from 'realm';
import {Realm} from '@realm/react';
import Task from './realm';

export const filterTasks = async (tasks: Results<Task>, realm: Realm) => {
  let syncTasks = tasks.filtered('isComplete == false');
  for (let item of syncTasks) {
    try {
      const body = JSON.stringify({
        id: item._id.toHexString(),
        description: item.description,
      });
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        },
      );

      if (response.ok) {
        realm.write(() => {
          item.isComplete = true;
        });
      } else {
        Alert.alert(
          'Sync failed with status:',
          JSON.stringify(response.status),
        );
      }
    } catch (error) {
      Alert.alert('Sync failed with status:', JSON.stringify(error));
    }
  }
};
