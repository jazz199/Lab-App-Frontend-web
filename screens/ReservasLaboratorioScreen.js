import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getLabReservations } from '../api';
import Layout from '../components/layout';
import ReservasLaboratorioList from '../components/ReservaLaboratorioList';

const ReservasLaboratorioScreen = () => {
  const [reservas, setReservas] = useState([]);

  const loadReservas = async () => {
    try {
      const data = await getLabReservations();
      setReservas(data);
    } catch (error) {
      console.error('Error en loadReservas:', error);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10 }}>
        Lista de Reservas de Laboratorio
      </Text>
      <ReservasLaboratorioList reservas={reservas} />
    </Layout>
  );
};

export default ReservasLaboratorioScreen;