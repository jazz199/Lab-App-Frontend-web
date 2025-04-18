import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import UserFormScreen from "./screens/UserFormScreen";
import LaboratoryScreen from "./screens/LaboratoryScreen";
import EquipmentScreen from "./screens/EquipmentScreen";
import MantenimientoScreen from "./screens/MantenimientoScreen";
import PrestamosScreen from "./screens/PrestamosScreen";
import ReservasLaboratorioScreen from "./screens/ReservasLaboratorioScreen";
import CategoriaEquiposScreen from "./screens/CategoriaEquiposScreen";

const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (loggedUser, goToRegister = false) => {
    if (loggedUser) {
      console.log('Usuario logueado:', loggedUser);
      setUser(loggedUser);
    }
    if (goToRegister) setShowRegister(true);
    else setShowRegister(false);
  };

  const handleRegister = () => setShowRegister(false);

  if (!user) {
    return showRegister ? <RegisterScreen onRegister={handleRegister} /> : <LoginScreen onLogin={handleLogin} />;
  }

  const AdminDrawer = () => (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: { backgroundColor: '#222f3e', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#222f3e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
        options={{ title: "Inicio" }}
      />
      <Drawer.Screen
        name="Usuarios"
        component={UserFormScreen}
        options={{ title: "Usuarios" }}
      />
      <Drawer.Screen
        name="Laboratorios"
        component={LaboratoryScreen}
        options={{ title: "Laboratorios" }}
      />
      <Drawer.Screen
        name="Equipos"
        component={EquipmentScreen}
        options={{ title: "Equipos" }}
      />
      <Drawer.Screen
        name="Mantenimiento"
        component={MantenimientoScreen}
        options={{ title: "Mantenimiento" }}
      />
      <Drawer.Screen
        name="Prestamos"
        component={PrestamosScreen}
        options={{ title: "Préstamos" }}
      />
      <Drawer.Screen
        name="ReservasLaboratorio"
        component={ReservasLaboratorioScreen}
        options={{ title: "Reservas Lab" }}
      />
      <Drawer.Screen
        name="CategoriaEquipos"
        component={CategoriaEquiposScreen}
        options={{ title: "Categorías" }}
      />
    </Drawer.Navigator>
  );

  const roleScreens = {
    estudiante: [
      <Tab.Screen
        key="Home"
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
        options={{ title: "Inicio" }}
      />,
    ],
    profesor: [
      <Tab.Screen
        key="Home"
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
        options={{ title: "Inicio" }}
      />,
    ],
    personal: [
      <Tab.Screen
        key="Home"
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
        options={{ title: "Inicio" }}
      />,
      <Tab.Screen key="Equipos" name="Equipos" component={EquipmentScreen} />,
      <Tab.Screen key="Mantenimiento" name="Mantenimiento" component={MantenimientoScreen} />,
    ],
    admin: [<Drawer.Screen key="AdminDrawer" name="AdminDrawer" component={AdminDrawer} options={{ title: "Menu" }} />],
  };

  const screens = roleScreens[user.tipo_usuario] || [];

  if (screens.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Rol de usuario no válido: {user.tipo_usuario}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lab-App</Text>
          </View>
          <View style={styles.tabContainer}>
            {user.tipo_usuario === 'admin' ? (
              <AdminDrawer />
            ) : (
              <Tab.Navigator
                screenOptions={{
                  tabBarStyle: { backgroundColor: '#222f3e' },
                  tabBarLabelStyle: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
                  tabBarIndicatorStyle: { backgroundColor: '#1e90ff' },
                  tabBarPosition: 'bottom',
                  tabBarScrollEnabled: true,
                }}
              >
                {screens}
              </Tab.Navigator>
            )}
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e90ff' },
  container: { flex: 1 },
  header: { backgroundColor: '#222f3e', padding: 15, alignItems: 'flex-start' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  tabContainer: { flex: 1 },
  errorText: { color: '#ffffff', fontSize: 18, textAlign: 'center', marginTop: 20 },
});

export default App;