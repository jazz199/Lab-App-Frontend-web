import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Layout = ({ children }) => {
  return (
    <LinearGradient
      colors={['#020245', '#a10000']}
      style={styles.gradient}
    >
      <View style={styles.container}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
     marginHorizontal: 0.5, // Ajusta este valor según lo que necesites
  },
});

export default Layout;