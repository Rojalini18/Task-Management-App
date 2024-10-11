import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TaskList from '../screens/TaskList';
import TaskFormScreen from '../screens/TaskFormScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          //backgroundColor: Colors.background,
        },
      }}
      initialRouteName="TaskList">
      {/* Screens */}
      <Stack.Screen
        name="TaskList"
        component={TaskList}
        options={{title: 'TaskList'}}
      />
      <Stack.Screen
        name="TaskFormScreen"
        component={TaskFormScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
