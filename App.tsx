import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import TaskProvider from './src/context/TaskContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
      <Toast />
    </TaskProvider>
  );
}
