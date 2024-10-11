import React, {useContext, useState} from 'react';
import {
  View,
  Image,
  Modal,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {TaskContext} from '../context/TaskContext';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

interface TaskListProps {
  navigation: {
    navigate: (screen: string, params?: {taskId: string}) => void;
  };
}

const TaskList: React.FC<TaskListProps> = ({navigation}) => {
  // Extract tasks, deleteTask, updateTask, and loading status from TaskContext
  const {tasks, deleteTask, updateTask, loading} = useContext(TaskContext) as {
    tasks: Task[];
    deleteTask: (id: string) => void;
    updateTask: (task: Task) => void;
    loading: boolean;
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all Tasks'); // For filtering
  const [sortOrder, setSortOrder] = useState<string>('newest'); // For sorting

  // Modal state
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filter tasks based on the search query and current filter (completed/pending)
  const filteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter(task => {
      if (currentFilter === 'completed') return task.completed;
      if (currentFilter === 'pending') return !task.completed;
      return true; // 'all'
    });

  // Sort tasks based on the selected sort order (newest, oldest, due date)
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  // Function to open modal for deleting task
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setModalVisible(true);
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
    }
    setModalVisible(false);
    setTaskToDelete(null);
  };

  // Show loading spinner while tasks are being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.subText}>Hey, Buddy</Text>
          <Text style={styles.greetingText}>Be productive Today!</Text>
        </View>
        <Image
          source={require('../assets/Homescreen_Banner.png')}
          style={styles.image}
        />
      </View>
      {/* Search container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={'#ccc'}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Image
            source={require('../assets/Search_Icon.png')} // Add your search icon path here
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {/* Tabs to filter tasks by all, completed, or pending */}
        {['all Tasks', 'completed', 'pending'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              currentFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setCurrentFilter(filter)}>
            <Text style={styles.filterText}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {/* Capitalize filter text */}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Centered Sort Button */}
      <View style={styles.sortButtonContainer}>
        {/* Button to toggle sort order between newest, oldest, and due date */}
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() =>
            setSortOrder(prevOrder =>
              prevOrder === 'newest'
                ? 'oldest'
                : prevOrder === 'oldest'
                ? 'dueDate'
                : 'newest',
            )
          }>
          <Text style={styles.sortButtonText}>
            Sort by: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}{' '}
            {/* Show current sort order */}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Task List */}
      <FlatList
        data={sortedTasks}
        keyExtractor={task => task.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TaskFormScreen', {taskId: item.id})
              }>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.dueDate}>Due Date: {item.dueDate}</Text>
              <Text style={styles.status}>
                {item.completed ? 'Completed' : 'Pending'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() =>
                  updateTask({...item, completed: !item.completed})
                }>
                {item.completed ? (
                  <View style={styles.checkedBox}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </TouchableOpacity>
              {/* Delete Task Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}>
                <Text
                  style={styles.buttonText}
                  testID={`delete-button-${item.id}`}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskFormScreen')}>
        <Text style={styles.addButtonText}>Add New Task + </Text>
      </TouchableOpacity>
      {/* Confirmation Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this task?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    color: '#555',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    padding: 8,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
  },
  activeFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  filterText: {
    fontSize: 16,
    color: '#007BFF',
  },
  sortButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    color: '#007BFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkBox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
  },
  uncheckedBox: {
    width: '100%',
    height: '100%',
    borderColor: '#007BFF',
    borderWidth: 2,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    color: '#000',
    marginBottom: 20,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
