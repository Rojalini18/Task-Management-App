import React, {useContext, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {TaskContext} from '../context/TaskContext';
import uuid from 'react-native-uuid'; // UUID for generating unique task IDs
import DatePicker from 'react-native-date-picker'; // DatePicker component for selecting due dates
import Toast from 'react-native-toast-message'; // Toast component for displaying notifications

const TaskFormScreen = ({route, navigation}) => {
  const {addTask, updateTask, tasks} = useContext(TaskContext);
  const taskId = route.params?.taskId;
  const taskToEdit = tasks.find(task => task.id === taskId); // Find the task to edit, if taskId exists

  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(
    taskToEdit ? taskToEdit.description : '',
  );
  const [dueDate, setDueDate] = useState(
    taskToEdit ? new Date(taskToEdit.dueDate) : null, // Set to null if not editing
  );
  const [open, setOpen] = useState(false); // State to control the date picker modal

  // State variables for error messages
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState(''); // State for date error

  const handleSave = () => {
    let valid = true; // Validation flag

    // Reset all error states before validation
    setTitleError('');
    setDescriptionError('');
    setDateError('');

    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required.'); // Set error message if title is empty
      valid = false;
    }

    // Validate description
    if (!description.trim()) {
      setDescriptionError('Description is required.'); // Set error message if description is empty
      valid = false;
    }

    // Validate due date
    if (!dueDate) {
      setDateError('Due date is required.'); // Set error message if no date is selected
      valid = false;
    } else {
      const today = new Date();
      if (dueDate < today) {
        setDateError('Due date cannot be in the past.'); // Set error if date is in the past
        valid = false;
      }
    }

    if (!valid) return;

    // Format the due date to YYYY-MM-DD format
    const formattedDate = dueDate.toISOString().split('T')[0];

    if (taskToEdit) {
      // Updating task
      updateTask({...taskToEdit, title, description, dueDate: formattedDate});
      Toast.show({
        text1: 'Task Updated',
        text2: 'Your task has been updated successfully!',
        type: 'success',
      });
    } else {
      // Adding new task
      addTask({
        id: uuid.v4(),
        title,
        description,
        dueDate: formattedDate, // Use the formatted date
        completed: false,
      });
      Toast.show({
        text1: 'Task Created',
        text2: 'Your task has been created successfully!',
        type: 'success',
      });
    }
    navigation.goBack();
  };

  // Function to reset error messages
  const resetErrors = () => {
    setTitleError('');
    setDescriptionError('');
    setDateError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {taskToEdit ? 'Edit Task' : 'Add New Task'}
      </Text>
      <Text style={styles.labelText}>Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={'#ccc'}
        value={title}
        onChangeText={text => {
          setTitle(text);
          if (titleError) resetErrors(); // Reset errors on input change
        }}
      />
      {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

      <Text style={styles.labelText}>Description *</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor={'#ccc'}
        value={description}
        onChangeText={text => {
          setDescription(text);
          if (descriptionError) resetErrors(); // Reset errors on input change
        }}
        multiline
        numberOfLines={4}
      />
      {descriptionError ? (
        <Text style={styles.errorText}>{descriptionError}</Text>
      ) : null}

      <Text style={styles.labelText}>Due date *</Text>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          style={styles.input}
          placeholderTextColor={'#ccc'}
          placeholder="Due Date (YYYY-MM-DD)"
          value={dueDate ? dueDate.toISOString().split('T')[0] : ''} // Display formatted date or empty
          editable={false} // Make input non-editable
        />
      </TouchableOpacity>
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

      <DatePicker
        modal
        open={open}
        date={dueDate || new Date()} // Set current date if dueDate is null
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDueDate(date);
          resetErrors(); // Reset errors when a date is selected
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskFormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  labelText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 10,
    color: '#8E8297',
  },
  input: {
    color: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
