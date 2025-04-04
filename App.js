import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import UserFormScreen from "./screens/UserFormScreen";
import LaboratoryScreen from "./screens/LaboratoryScreen";
import EquipmentScreen from "./screens/EquipmentScreen";
import MantenimientoScreen from "./screens/MantenimientoScreen";
import PrestamosScreen from "./screens/PrestamosScreen"; // New
import ReservasLaboratorioScreen from "./screens/ReservasLaboratorioScreen"; // New
import CategoriaEquiposScreen from "./screens/CategoriaEquiposScreen"; // New

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
        <Stack.Screen name="Usuarios" component={UserFormScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
        <Stack.Screen name="Laboratorios" component={LaboratoryScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
        <Stack.Screen name="Equipos" component={EquipmentScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
        <Stack.Screen name="Mantenimiento" component={MantenimientoScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
        <Stack.Screen name="Prestamos" component={PrestamosScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
        <Stack.Screen name="ReservasLaboratorio" component={ReservasLaboratorioScreen} 
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }}/>
        <Stack.Screen name="CategoriaEquipos" component={CategoriaEquiposScreen}
        options={{
          headerStyle: { backgroundColor: "#222f3e" },
          headerTitleStyle: { color: '#ffffff' }
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;