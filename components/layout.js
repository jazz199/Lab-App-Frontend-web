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
    padding: 20,
    alignItems: 'center',
  },
});

export default Layout;