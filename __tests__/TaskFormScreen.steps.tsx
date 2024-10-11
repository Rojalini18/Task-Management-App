import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import TaskFormScreen from '../src/screens/TaskFormScreen';
import {TaskContext} from '../src/context/TaskContext';
//import mockdate from 'mockdate';

// Mock navigation and route
const mockNavigation = {goBack: jest.fn()};
const mockRoute = {params: {}};

// Mock UUID
jest.mock('react-native-uuid', () => ({
  v4: () => 'test-uuid',
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock('react-native-date-picker', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock('react-native-toast-message', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('TaskFormScreen', () => {
  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const tasks = [];

  const taskContextValue = {
    addTask: mockAddTask,
    updateTask: mockUpdateTask,
    tasks,
  };

  // beforeEach(() => {
  //   mockdate.set(new Date(2023, 9, 10)); // Set current date for consistent date comparison
  // });

  // afterEach(() => {
  //   mockdate.reset();
  //   jest.clearAllMocks();
  // });

  it('renders the form screen correctly', () => {
    const {getByPlaceholderText, getByText} = render(
      <TaskContext.Provider value={taskContextValue}>
        <TaskFormScreen navigation={mockNavigation} route={mockRoute} />
      </TaskContext.Provider>,
    );

    expect(getByText('Add New Task')).toBeTruthy();
    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Due Date (YYYY-MM-DD)')).toBeTruthy();
  });

  it('displays validation errors when submitting empty form', async () => {
    const {getByText, getByPlaceholderText} = render(
      <TaskContext.Provider value={taskContextValue}>
        <TaskFormScreen navigation={mockNavigation} route={mockRoute} />
      </TaskContext.Provider>,
    );

    fireEvent.changeText(getByPlaceholderText('Title'), '');
    fireEvent.changeText(getByPlaceholderText('Description'), '');
    fireEvent.press(getByText('Save Task'));

    expect(getByText('Title is required.')).toBeTruthy();
    expect(getByText('Description is required.')).toBeTruthy();
    expect(getByText('Due date is required.')).toBeTruthy();
  });

  it('adds a new task successfully', async () => {
    const {getByText, getByPlaceholderText} = render(
      <TaskContext.Provider value={taskContextValue}>
        <TaskFormScreen navigation={mockNavigation} route={mockRoute} />
      </TaskContext.Provider>,
    );

    // Enter valid title, description, and set a future date
    fireEvent.changeText(getByPlaceholderText('Title'), 'New Task');
    fireEvent.changeText(
      getByPlaceholderText('Description'),
      'Task Description',
    );

    // Mock date picker action
    fireEvent.press(getByPlaceholderText('Due Date (YYYY-MM-DD)'));
    await waitFor(() => getByText('Save Task')); // Simulate date picker confirmation

    fireEvent.press(getByText('Save Task'));

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith({
        id: 'test-uuid',
        title: 'New Task',
        description: 'Task Description',
        dueDate: '2023-10-10', // Mocked date
        completed: false,
      });
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('updates an existing task successfully', async () => {
    const taskToEdit = {
      id: '1',
      title: 'Existing Task',
      description: 'Task Description',
      dueDate: '2023-10-12',
      completed: false,
    };

    mockRoute.params = {taskId: '1'};
    taskContextValue.tasks = [taskToEdit];

    const {getByText, getByPlaceholderText} = render(
      <TaskContext.Provider value={taskContextValue}>
        <TaskFormScreen navigation={mockNavigation} route={mockRoute} />
      </TaskContext.Provider>,
    );

    expect(getByPlaceholderText('Title').props.value).toBe('Existing Task');

    fireEvent.changeText(getByPlaceholderText('Title'), 'Updated Task');
    fireEvent.press(getByText('Save Task'));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith({
        ...taskToEdit,
        title: 'Updated Task',
        dueDate: '2023-10-12', // unchanged
      });
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
