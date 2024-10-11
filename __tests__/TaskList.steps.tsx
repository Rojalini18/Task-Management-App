import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {TaskContext} from '../src/context/TaskContext';
import TaskList from '../src/screens/TaskList';

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'This is a test task.',
    dueDate: '2024-10-15',
    completed: false,
    createdAt: '2024-10-01',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'This is another test task.',
    dueDate: '2024-10-10',
    completed: true,
    createdAt: '2024-10-02',
  },
];

const mockDeleteTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockLoading = false;

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

const renderWithContext = (loading = mockLoading) => {
  return render(
    <TaskContext.Provider
      value={{
        tasks: mockTasks,
        deleteTask: mockDeleteTask,
        updateTask: mockUpdateTask,
        loading,
      }}>
      <TaskList navigation={{navigate: jest.fn()}} />
    </TaskContext.Provider>,
  );
};

describe('TaskList Component', () => {
  test('renders loading state', () => {
    const {getByText} = renderWithContext(true);
    expect(getByText(/loading tasks/i)).toBeTruthy();
  });

  test('renders tasks correctly', () => {
    const {getByText} = renderWithContext();
    expect(getByText('Test Task 1')).toBeTruthy();
    expect(getByText('This is a test task.')).toBeTruthy();
    expect(getByText('Due Date: 2024-10-15')).toBeTruthy();
  });

  test('searches for tasks correctly', async () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithContext();
    const searchInput = getByPlaceholderText(/search tasks.../i);

    fireEvent.changeText(searchInput, 'Test Task 1');

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(queryByText('Test Task 2')).toBeFalsy();
    });
  });

  test('filters tasks correctly', async () => {
    const {getByText, queryByText} = renderWithContext();

    fireEvent.press(getByText(/completed/i));
    await waitFor(() => {
      expect(queryByText('Test Task 1')).toBeFalsy();
      expect(getByText('Test Task 2')).toBeTruthy();
    });
  });

  test('sorts tasks correctly', async () => {
    const {getByText} = renderWithContext();

    // Initially sorted by newest
    expect(getByText('Test Task 1')).toBeTruthy();
    fireEvent.press(getByText(/sort by:/i));

    await waitFor(() => {
      expect(getByText('Test Task 2')).toBeTruthy();
    });
  });

  test('deletes a task', async () => {
    const {getByText, getByTestId} = renderWithContext();

    fireEvent.press(getByTestId('delete-button-1'));
    expect(
      getByText(/are you sure you want to delete this task/i),
    ).toBeTruthy();

    fireEvent.press(getByTestId('delete-button-1'));
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  test('cancels task deletion', async () => {
    const {getByText, getByTestId} = renderWithContext();

    fireEvent.press(getByTestId('delete-button-1'));
    expect(
      getByText(/are you sure you want to delete this task/i),
    ).toBeTruthy();

    fireEvent.press(getByText('Cancel'));
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });
});
