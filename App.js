import React from "react";
import { Text, TouchableOpacity } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import UsersFormScreen from "./screens/UserFormScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerStyle: {backgroundColor: "#222f3e"},
         headerTitleStyle: {color: '#ffffff'},
         headerRight: () => (
          <TouchableOpacity onPress={() => console.log('P')}>
            <Text>
              Holas
            </Text>
          </TouchableOpacity>
       )
         }}/>
        <Stack.Screen name="User Form" component={UsersFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;