import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HomeScreen from "./screens/HomeScreen";
import UserFormScreen from "./screens/UserFormScreen";
import LaboratoryScreen from "./screens/LaboratoryScreen";
import EquipmentScreen from "./screens/EquipmentScreen";
import MantenimientoScreen from "./screens/MantenimientoScreen";
import PrestamosScreen from "./screens/PrestamosScreen";
import ReservasLaboratorioScreen from "./screens/ReservasLaboratorioScreen";
import CategoriaEquiposScreen from "./screens/CategoriaEquiposScreen";

const Tab = createMaterialTopTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Título encima de la barra de navegación */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lab-App</Text>
          </View>

          {/* Navegación con pestañas en la parte inferior */}
          <View style={styles.tabContainer}>
            <Tab.Navigator
              screenOptions={{
                tabBarStyle: {
                  backgroundColor: "#222f3e", // Fondo oscuro para las pestañas
                },
                tabBarLabelStyle: {
                  color: "#ffffff", // Color del texto de las pestañas
                  fontSize: 12, // Tamaño de fuente más pequeño para ajustar varias pestañas
                  fontWeight: "bold",
                },
                tabBarIndicatorStyle: {
                  backgroundColor: "#1e90ff", // Línea indicadora azul
                },
                tabBarPosition: "bottom", // Mover las pestañas a la parte inferior
                tabBarScrollEnabled: true, // Habilitar desplazamiento horizontal si hay muchas pestañas
              }}
            >
              <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
              <Tab.Screen name="Usuarios" component={UserFormScreen} />
              <Tab.Screen name="Laboratorios" component={LaboratoryScreen} />
              <Tab.Screen name="Equipos" component={EquipmentScreen} />
              <Tab.Screen name="Mantenimiento" component={MantenimientoScreen} />
              <Tab.Screen name="Prestamos" component={PrestamosScreen} options={{ title: "Préstamos" }} />
              <Tab.Screen name="ReservasLaboratorio" component={ReservasLaboratorioScreen} options={{ title: "Reservas Lab" }} />
              <Tab.Screen name="CategoriaEquipos" component={CategoriaEquiposScreen} options={{ title: "Categorías" }} />
            </Tab.Navigator>
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e90ff", // Fondo para el área segura
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1e90ff", // Fondo azul para el título
    padding: 15,
    alignItems: "flex-start", // Alinear el contenido a la izquierda
  },
  headerTitle: {
    color: "#ffffff", // Texto blanco
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    flex: 1,
  },
});

export default App;