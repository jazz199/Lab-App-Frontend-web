import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import { getMaintenaint } from '../api.js';
import Layout from '../components/layout.js';
import MantenimientoList from '../components/MantenimientoList'

const MantenimientoScreen = () => {
  const [mantenimiento, setMantenimiento] = useState ([]);

  const loadMaintenaint = async () => {
    try {
      const data = await getMaintenaint();
      setMantenimiento(data); // Changed from setMaintenaint to setMantenimiento
    } catch (error) {
      console.error('Error en load Mantenimiento:', error);
    }
  };

  useEffect(() => {
    loadMaintenaint();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10}}>Mantenimiento</Text>
      <MantenimientoList mantenimiento={mantenimiento}/>
    </Layout>
  );
}
export default MantenimientoScreen;
