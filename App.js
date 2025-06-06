import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from "react-native";
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
import CalendarScreen from "./screens/CalendarScreen";
import SupportScreen from "./screens/SuportChatScreen";

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
        style={{ padding: 16, backgroundColor: 'rgba(208, 18, 18, 0.76)', margin: 16, borderRadius: 8 }}
        onPress={onLogout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Tabs principales para web
const MainTabs = ({ user, role }) => (
  <Tab.Navigator
    tabBarPosition="top"
    screenOptions={{
      tabBarStyle: { backgroundColor: 'rgba(28, 42, 90, 1)' },
      tabBarLabelStyle: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
      tabBarIndicatorStyle: { backgroundColor: '#1e90ff' },
      tabBarScrollEnabled: true,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
    <Tab.Screen name="Calendario" component={CalendarScreen} options={{ title: "Calendario" }} />
  </Tab.Navigator>
);

// Drawer para web: las demás ventanas (usuarios, laboratorios, equipos, etc.)
const WebAdminDrawer = ({ user, onLogout }) => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
    screenOptions={{
      drawerPosition: 'left',
      drawerStyle: { backgroundColor: 'rgba(42, 47, 74, 0.76), rgba(42, 47, 74, 0.68)', width: 250 },
      drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
      headerStyle: { backgroundColor: 'rgba(28, 42, 90, 1)' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Drawer.Screen name="Principal" options={{ title: "Principal" }}>
      {() => <MainTabs user={user} role="admin" />}
    </Drawer.Screen>
    <Drawer.Screen name="Usuarios" component={UserFormScreen} options={{ title: "Usuarios" }} />
    <Drawer.Screen name="Laboratorios" component={LaboratoryScreen} options={{ title: "Laboratorios" }} />
    <Drawer.Screen name="Equipos" component={EquipmentScreen} options={{ title: "Equipos" }} />
    <Drawer.Screen name="Mantenimiento" component={MantenimientoScreen} options={{ title: "Mantenimiento" }} />
    <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ title: "Préstamos" }} />
    <Drawer.Screen name="ReservasLaboratorio" component={ReservasLaboratorioScreen} options={{ title: "Reservas" }} />
    <Drawer.Screen name="Soporte" component={SupportScreen} options={{ title: "Soporte" }} />
    <Drawer.Screen name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
    <Drawer.Screen name="CategoriaEquipos" component={CategoriaEquiposScreen} options={{ title: "Categorías" }} />
    <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} initialParams={{ user }} options={{ title: "Panel de Admin" }} />
  </Drawer.Navigator>
);

const WebUserDrawer = ({ user, onLogout }) => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
    screenOptions={{
      drawerPosition: 'left',
      drawerStyle: { backgroundColor: 'rgba(42, 47, 74, 0.76), rgba(42, 47, 74, 0.68)', width: 250 },
      drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
      headerStyle: { backgroundColor: '#222f3e' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Drawer.Screen name="Principal" options={{ title: "Principal" }}>
      {() => <MainTabs user={user} role={user.tipo_usuario} />}
    </Drawer.Screen>
    {/* Puedes agregar aquí las pantallas que correspondan al usuario normal */}
    <Drawer.Screen name="Soporte" component={SupportScreen} options={{ title: "Soporte" }} />
    <Drawer.Screen name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
  </Drawer.Navigator>
);

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

  // Navegación móvil (Drawer clásico)
  const AdminDrawer = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: { backgroundColor: 'rgba(42, 47, 74, 0.76), rgba(42, 47, 74, 0.68)', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'rgba(28, 42, 90, 1)' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
      <Drawer.Screen name="Calendario" component={CalendarScreen} options={{ title: "Calendario" }} />
      <Drawer.Screen name="Soporte" component={SupportScreen} options={{ title: "Soporte" }} />
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
        drawerStyle: { backgroundColor: 'rgba(42, 47, 74, 0.76), rgba(42, 47, 74, 0.68)', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#222f3e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
      <Drawer.Screen name="Calendario" component={CalendarScreen} options={{ title: "Calendario" }} />
      <Drawer.Screen name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
      <Drawer.Screen name="Soporte" component={SupportScreen} options={{ title: "Soporte" }} />
    </Drawer.Navigator>
  );

  const TecnicoNavigator = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: { backgroundColor: 'rgba(42, 47, 74, 0.76), rgba(42, 47, 74, 0.68)', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'rgba(28, 42, 90, 1)' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen key="Home" name="Home" component={HomeScreen} initialParams={{ user }} options={{ title: "Inicio" }} />
      <Drawer.Screen key="Equipos" name="Equipos" component={EquipmentScreen} />
      <Drawer.Screen key="Mantenimiento" name="Mantenimiento" component={MantenimientoScreen} />
      <Drawer.Screen key="ReporteLaboratorios" name="ReporteLaboratorios" component={UserLabReportScreen} initialParams={{ user }} options={{ title: "Reporte Labs" }} />
      <Drawer.Screen key="Support" name="Soporte" component={SupportScreen} options={{ title: "Soporte" }} />
    </Drawer.Navigator>
  );

  const roleScreens = {
    estudiante: [<Drawer.Screen key="UserDrawer" name="UserDrawer" component={UserDrawer} options={{ title: "Menu" }} />],
    profesor: [<Drawer.Screen key="UserDrawer" name="UserDrawer" component={UserDrawer} options={{ title: "Menu" }} />],
    personal: [<Drawer.Screen key="TecnicoNavigator" name="TecnicoNavigator" component={TecnicoNavigator} options={{ title: "Menu" }} />],
    admin: [<Drawer.Screen key="AdminDrawer" name="AdminDrawer" component={AdminDrawer} options={{ title: "Menu" }} />],
  };

  const screens = roleScreens[user.tipo_usuario] || [];
  if (screens.length === 0) {
    Alert.alert(
      "Error",
      "Usuario o contraseña equivocados",
      [
        {
          text: "OK",
          onPress: () => setUser(null), // Volver al login
        },
      ],
      { cancelable: false }
    );
    return null; // No renderices el Tab.Navigator
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lab-App</Text>
          </View>
          <View style={styles.tabContainer}>
            {Platform.OS === "web" ? (
              user.tipo_usuario === "admin" ? (
                <WebAdminDrawer user={user} onLogout={handleLogout} />
              ) : (
                <WebUserDrawer user={user} onLogout={handleLogout} />
              )
            ) : (
              ['admin', 'estudiante', 'profesor', 'personal'].includes(user.tipo_usuario) ? (
                user.tipo_usuario === 'admin' ? <AdminDrawer /> : <UserDrawer />
              ) : (
                <Tab.Navigator
                  tabBarPosition="bottom"
                  screenOptions={{
                    tabBarStyle: { backgroundColor: 'rgba(231, 17, 17, 0.1)' },
                    tabBarLabelStyle: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
                    tabBarIndicatorStyle: { backgroundColor: '#1e90ff' },
                    tabBarScrollEnabled: true,
                  }}
                >
                  {screens}
                </Tab.Navigator>
              )
            )}
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'rgba(4, 2, 46, 0.99)' },
  container: { flex: 1 },
  header: { backgroundColor: 'rgba(28, 42, 90, 1)', padding: 15, alignItems: 'flex-start' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  tabContainer: { flex: 1 },
  errorText: { color: '#ffffff', fontSize: 18, textAlign: 'center', marginTop: 20 },
});

export default App;