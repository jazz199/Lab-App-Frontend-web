import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getUserLabReport } from '../api';
import Layout from '../components/layout';
import UserLabReportList from '../components/UserLabReportList';

const UserLabReportScreen = ({ route }) => {
  const user = route.params?.user || { id: null };
  const [report, setReport] = useState({
    laboratorios_prestados: [],
    laboratorios_no_entregados: [],
    todas_reservas: [],
    total_reservas: 0
  });
  const [loading, setLoading] = useState(true);

  console.log('User in UserLabReportScreen:', user);

  const loadReport = async () => {
    if (!user.id) {
      console.log('No user ID available');
      Alert.alert('Error', 'ID de usuario no disponible');
      setLoading(false);
      return;
    }
    try {
      const data = await getUserLabReport(user.id);
      console.log('Report data received:', data);
      setReport({
        laboratorios_prestados: data?.laboratorios_prestados || [],
        laboratorios_no_entregados: data?.laboratorios_no_entregados || [],
        todas_reservas: data?.todas_reservas || [],
        total_reservas: data?.total_reservas || 0
      });
    } catch (error) {
      console.error('Error en loadReport:', error.message);
      console.log('Error details:', error);
      Alert.alert('Error', 'No se pudo cargar el reporte de laboratorios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      loadReport();
    } else {
      setLoading(false);
    }
  }, [user.id]);

  if (loading) {
    return (
      <Layout>
        <Text style={styles.title}>Cargando reporte...</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Text style={styles.title}>Reporte de Laboratorios - Usuario {user.id || 'Desconocido'}</Text>
      <Text style={styles.subtitle}>Total Reservas: {report.total_reservas}</Text>

      <Text style={styles.sectionTitle}>Todas las Reservas</Text>
      {report.todas_reservas && report.todas_reservas.length > 0 ? (
        <UserLabReportList reservas={report.todas_reservas} />
      ) : (
        <Text style={styles.noDataText}>No hay reservas registradas</Text>
      )}

      <Text style={styles.sectionTitle}>Laboratorios Prestados</Text>
      {report.laboratorios_prestados && report.laboratorios_prestados.length > 0 ? (
        <UserLabReportList reservas={report.laboratorios_prestados} />
      ) : (
        <Text style={styles.noDataText}>No hay laboratorios prestados</Text>
      )}

      <Text style={styles.sectionTitle}>Laboratorios No Entregados</Text>
      {report.laboratorios_no_entregados && report.laboratorios_no_entregados.length > 0 ? (
        <UserLabReportList reservas={report.laboratorios_no_entregados} />
      ) : (
        <Text style={styles.noDataText}>No hay laboratorios no entregados</Text>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noDataText: {
    color: '#e0e0e0',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserLabReportScreen;