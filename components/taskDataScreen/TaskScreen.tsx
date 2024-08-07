import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageProps,
} from 'react-native';
import {Realm, useRealm, useQuery} from '@realm/react';
import Task from '../../databaseLocal/realm';
import {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {checkBox, EditImg, plusImg, TrashImg} from '../../assets/assets';
import {checkNetworkConnectivity} from '../../databaseLocal/networkConnection';
import {filterTasks} from '../../databaseLocal/database';
import colors from '../../constants/colors';
const configJSON = require('./config');

interface TaskTypes {
  _id: Realm.BSON.ObjectId;
  description: string;
  isComplete: boolean;
  createdAt: Date;
}
const TaskScreen: React.FC = () => {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [newDescription, setNewDescription] = useState('');
  const [editingTask, setEditingTask] = useState<TaskTypes | null>(null);

  const handleAddOrUpdateTask = () => {
    if (newDescription.trim()) {
      realm.write(() => {
        if (editingTask) {
          editingTask.description = newDescription;
          editingTask.isComplete = false;
          setEditingTask(null);
        } else {
          realm.create('Task', Task.generate(newDescription));
        }
      });
      setNewDescription('');
      handleSync();
    }
  };
  const handleSync = async () => {
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
      filterTasks(tasks, realm);
    }
  };
  const handleEditTask = (task: TaskTypes) => {
    setEditingTask(task);
    setNewDescription(task.description);
  };

  const handleDeleteTask = (task: TaskTypes) => {
    if (String(editingTask?._id) !== String(task?._id)) {
      realm.write(() => {
        realm.delete(task);
      });
    }
  };

  const renderButton = ({
    icon,
    onPress,
    toggleColor,
    testID,
  }: {
    icon: ImageProps;
    onPress?: () => void;
    toggleColor?: boolean;
    testID?: string;
  }) => {
    return (
      <TouchableOpacity
        style={{marginRight: responsiveWidth(3)}}
        testID={testID}
        onPress={onPress}>
        <Image
          tintColor={toggleColor ? colors.liteGreen : colors.liteShadeBlue}
          source={icon}
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  const renderTaskList = ({item}: {item: TaskTypes}) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskDescription}>{item.description}</Text>
      {renderButton({
        icon: EditImg,
        onPress: () => handleEditTask(item),
        testID: 'EditBtn',
      })}
      {renderButton({
        icon: TrashImg,
        onPress: () => handleDeleteTask(item),
        testID: 'DeleteBtn',
      })}
      {renderButton({icon: checkBox, toggleColor: item.isComplete})}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          testID="input_box"
          style={styles.input}
          value={newDescription}
          placeholderTextColor={colors.liteShadeBlue}
          placeholder={configJSON.placeholderText}
          onChangeText={setNewDescription}
        />
        <Pressable
          testID="addAndUpdateBtn"
          style={styles.addButton}
          onPress={handleAddOrUpdateTask}>
          <Image
            tintColor={colors.mediumShadeBlue}
            source={editingTask ? EditImg : plusImg}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <View style={styles.renderListStyle}>
        <FlatList
          testID="taskList"
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          contentContainerStyle={styles.contentContainerStyle}
          data={tasks.sorted('createdAt')}
          keyExtractor={item => item._id.toHexString()}
          renderItem={renderTaskList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.liteShade,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: responsiveHeight(3),
    backgroundColor: colors.mediumShadeBlue,
    padding: responsiveHeight(2),
    elevation: 10,
    shadowColor: colors.darkShadeGray,
  },
  input: {
    flex: 1,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    color: colors.white,
  },
  addButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
    backgroundColor: colors.white,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 10,
    elevation: 10,
    shadowColor: colors.darkShadeGray,
  },
  taskDescription: {
    flex: 1,
    marginHorizontal: 8,
    color: colors.mediumShadeBlue,
  },
  iconStyle: {
    height: responsiveHeight(4),
    width: responsiveWidth(7),
  },
  renderListStyle: {padding: responsiveHeight(1), flex: 1},
  contentContainerStyle: {padding: responsiveWidth(3)},
});

export default TaskScreen;
