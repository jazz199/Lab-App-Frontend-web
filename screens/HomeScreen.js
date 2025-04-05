import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Layout from '../components/layout';

const HomeScreen = () => {
  return (
    <Layout>
      <Text style={styles.title}>Bienvenido</Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;