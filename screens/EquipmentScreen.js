import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getEquipment } from '../api';
import Layout from '../components/layout';
import EquipmentList from '../components/EquipmentList';

const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState([]);

  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10 }}>Lista de Equipos</Text>
      <EquipmentList equipment={equipment} />
    </Layout>
  );
};

export default EquipmentScreen;