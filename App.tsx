import React, {useState} from 'react';

import {Realm, RealmProvider} from '@realm/react';
import TaskScreen from './components/taskDataScreen/TaskScreen';
import NoInternetConnection from './components/internetConnectivity/NoInternetConnection';
import Task from './databaseLocal/realm';

const migration = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 3) {
    const oldObjects = oldRealm.objects<Task>('Task');
    const newObjects = newRealm.objects<Task>('Task');

    for (let i = 0; i < oldObjects.length; i++) {
      newObjects[i].isComplete = false;
    }
  }
};

const App = () => {
  return (
    <RealmProvider schema={[Task]} schemaVersion={3} onMigration={migration}>
      <TaskScreen />
      <NoInternetConnection />
    </RealmProvider>
  );
};
export default App;
