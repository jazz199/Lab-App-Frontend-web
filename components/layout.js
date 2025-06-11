import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Layout = ({ children }) => {
  return (
    <LinearGradient
      colors={[
        'rgb(2, 3, 55)',  // Azul marino con opacidad (transición)
        'rgb(5, 6, 75)',         // Azul marino intenso (centro)
        'rgba(5, 6, 75, 0.85)',
        'rgb(255, 215, 0)',      // Amarillo intenso (arriba)
          // Azul marino con opacidad (abajo)
      ]}
      locations={[0, 0.25, 0.65, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 0,
    width: '100%',
    maxWidth: 1600,
  },
});

export default Layout;