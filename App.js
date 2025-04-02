import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import UserFormScreen from "./screens/UserFormScreen";
import LaboratoryScreen from "./screens/LaboratoryScreen";
import EquipmentScreen from "./screens/EquipmentScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerStyle: { backgroundColor: "#222f3e" },
            headerTitleStyle: { color: '#ffffff' }
          }}
        />
        <Stack.Screen name="Usuarios" component={UserFormScreen} />
        <Stack.Screen name="Laboratorios" component={LaboratoryScreen} />
        <Stack.Screen name="Equipos" component={EquipmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;