import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getLaboratories } from '../api';
import Layout from '../components/layout';
import LaboratoryList from '../components/LaboratoryList';

const LaboratoryScreen = () => {
  const [laboratories, setLaboratories] = useState([]);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(data);
    } catch (error) {
      console.error('Error en loadLaboratories:', error);
    }
  };

  useEffect(() => {
    loadLaboratories();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10 }}>Lista de Laboratorios</Text>
      <LaboratoryList laboratories={laboratories} />
    </Layout>
  );
};

export default LaboratoryScreen;