import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getLoans } from '../api';
import Layout from '../components/layout';
import PrestamosList from '../components/PrestamosList';

const PrestamosScreen = () => {
  const [prestamos, setPrestamos] = useState([]);

  const loadPrestamos = async () => {
    try {
      const data = await getLoans();
      setPrestamos(data);
    } catch (error) {
      console.error('Error en loadPrestamos:', error);
    }
  };

  useEffect(() => {
    loadPrestamos();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10 }}>
        Lista de Préstamos
      </Text>
      <PrestamosList prestamos={prestamos} />
    </Layout>
  );
};

export default PrestamosScreen;