import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const Layout = ({ children }) => {
  return (
    <LinearGradient
      colors={[
        'rgb(5, 6, 75)',   // Azul marino profundo (inicio)
        'rgba(5, 6, 75, 0.85)', // Azul marino con opacidad (centro)
        'rgba(5, 6, 75, 0.65)'  // Azul marino más claro (fin)
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
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