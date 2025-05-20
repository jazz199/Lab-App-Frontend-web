import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
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
import UserLabReportScreen from "./screens/UserLabReportScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";

const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const CustomDrawerContent = (props) => {
  const { onLogout } = props;
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#ff4444', margin: 16, borderRadius: 8 }}
        onPress={onLogout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (loggedUser, goToRegister = false) => {
    if (loggedUser) {
      setUser(loggedUser);
    }
    if (goToRegister) setShowRegister(true);
    else setShowRegister(false);
  };

  const handleRegister = () => setShowRegister(false);

  const handleLogout = () => setUser(null);

  if (!user) {
    return showRegister ? <RegisterScreen onRegister={handleRegister} /> : <LoginScreen onLogin={handleLogin} />;
  }

  const AdminDrawer = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: { backgroundColor: '#222f3e', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#222f3e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
      <Drawer.Screen name="Usuarios" component={UserFormScreen} options={{ title: "Usuarios" }} />
      <Drawer.Screen name="Laboratorios" component={LaboratoryScreen} options={{ title: "Laboratorios" }} />
      <Drawer.Screen name="Equipos" component={EquipmentScreen} options={{ title: "Equipos" }} />
      <Drawer.Screen name="Mantenimiento" component={MantenimientoScreen} options={{ title: "Mantenimiento" }} />
      <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ title: "Préstamos" }} />
      <Drawer.Screen name="ReservasLaboratorio" component={ReservasLaboratorioScreen} options={{ title: "Reservas" }} />
      <Drawer.Screen name="CategoriaEquipos" component={CategoriaEquiposScreen} options={{ title: "Categorías" }} />
      <Drawer.Screen name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
      <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} initialParams={{ user }} options={{ title: "Panel de Admin" }} />
    </Drawer.Navigator>
  );

  const UserDrawer = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: { backgroundColor: '#222f3e', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#222f3e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
      <Drawer.Screen name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
    </Drawer.Navigator>
  );

  const roleScreens = {
    estudiante: [<Drawer.Screen key="UserDrawer" name="UserDrawer" component={UserDrawer} options={{ title: "Menu" }} />],
    profesor: [<Drawer.Screen key="UserDrawer" name="UserDrawer" component={UserDrawer} options={{ title: "Menu" }} />],
    personal: [
      <Tab.Screen key="Home" name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />,
      <Tab.Screen key="Equipos" name="Equipos" component={EquipmentScreen} />,
      <Tab.Screen key="Mantenimiento" name="Mantenimiento" component={MantenimientoScreen} />,
      <Tab.Screen key="ReporteLaboratorios" name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />,
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
            {['admin', 'estudiante', 'profesor'].includes(user.tipo_usuario) ? (
              user.tipo_usuario === 'admin' ? <AdminDrawer /> : <UserDrawer />
            ) : (
              <Tab.Navigator
                tabBarPosition="bottom"
                screenOptions={{
                  tabBarStyle: { backgroundColor: '#222f3e' },
                  tabBarLabelStyle: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
                  tabBarIndicatorStyle: { backgroundColor: '#1e90ff' },
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