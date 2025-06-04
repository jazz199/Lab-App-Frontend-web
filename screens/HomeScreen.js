import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import Layout from '../components/layout';
import { getLaboratories, createLabReservation, updateLabReservation, updateLaboratory, getLabReservations } from '../api';

const HomeScreen = ({ route }) => {
  const user = route.params?.user || { tipo_usuario: 'estudiante', usuario_id: null };
  const [laboratories, setLaboratories] = useState([]);
  const [requests, setRequests] = useState([]);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      const updatedLabs = data.map(lab => ({
        ...lab,
        ocupado: !!lab.responsable_id,
      }));
      setLaboratories(updatedLabs);
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
    }
  };

  const loadRequests = async () => {
    if (user.tipo_usuario === 'admin') {
      try {
        const data = await getLabReservations();
        const pending = data.filter(res => res.estado === 'pendiente');
        setRequests(pending);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      }
    }
  };

  const handleRequest = async (labId) => {
    try {
      const reservationData = {
        laboratorio_id: labId,
        usuario_id: user.usuario_id,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
        proposito: 'Solicitud de responsabilidad',
        estado: 'pendiente',
      };
      await createLabReservation(reservationData);
      Alert.alert('Éxito', 'Solicitud enviada al administrador');
      loadLaboratories();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    }
  };

  const handleApprove = async (requestId, labId) => {
    try {
      const reservationData = { estado: 'aprobada' };
      const request = requests.find(req => req.reserva_id === requestId);
      const labData = { responsable_id: request.usuario_id };
      await updateLabReservation(requestId, reservationData);
      await updateLaboratory(labId, labData);
      Alert.alert('Éxito', 'Solicitud aprobada y laboratorio asignado');
      loadLaboratories();
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'No se pudo aprobar la solicitud');
    }
  };

  useEffect(() => {
    loadLaboratories();
    loadRequests();
    // eslint-disable-next-line
  }, []);

  // Responsive for web
  const isWeb = Platform.OS === 'web';
  const { width } = Dimensions.get('window');
  const numColumns = isWeb ? (width > 1100 ? 3 : width > 700 ? 2 : 1) : 1;
  const listContainerStyle = isWeb
    ? { alignItems: 'center', width: '100%', maxWidth: 1300, alignSelf: 'center', paddingBottom: 40 }
    : {};

  const renderLabItem = ({ item }) => (
    <View style={[styles.labItem, isWeb && styles.labItemWeb]}>
      <Text style={styles.labTitle}>{item.nombre}</Text>
      <Text style={styles.labText}>Ubicación: {item.ubicacion}</Text>
      <Text style={styles.labText}>Tipo: {item.tipo_laboratorio}</Text>
      <Text style={styles.labText}>Capacidad: {item.capacidad}</Text>
      <Text style={styles.labText}>Estado: {item.ocupado ? 'Ocupado' : 'Disponible'}</Text>
      {user.tipo_usuario !== 'admin' && !item.ocupado && (
        <TouchableOpacity style={styles.requestButton} onPress={() => handleRequest(item.laboratorio_id)}>
          <Text style={styles.buttonText}>Solicitar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRequestItem = ({ item }) => (
    <View style={[styles.requestItem, isWeb && styles.labItemWeb]}>
      <Text style={styles.requestText}>Usuario ID: {item.usuario_id}</Text>
      <Text style={styles.requestText}>Laboratorio ID: {item.laboratorio_id}</Text>
      <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.reserva_id, item.laboratorio_id)}>
        <Text style={styles.buttonText}>Aprobar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
        <Text style={styles.title}>Laboratorios Registrados</Text>
        <FlatList
          data={laboratories}
          keyExtractor={(item) => item.laboratorio_id.toString()}
          renderItem={renderLabItem}
          style={styles.list}
          contentContainerStyle={listContainerStyle}
          numColumns={numColumns}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay laboratorios</Text>}
        />
        {user.tipo_usuario === 'admin' && requests.length > 0 && (
          <>
            <Text style={styles.title}>Solicitudes Pendientes</Text>
            <FlatList
              data={requests}
              keyExtractor={(item) => item.reserva_id.toString()}
              renderItem={renderRequestItem}
              style={styles.list}
              contentContainerStyle={listContainerStyle}
              numColumns={numColumns}
              ListEmptyComponent={<Text style={styles.emptyText}>No hay solicitudes</Text>}
            />
          </>
        )}
      
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  list: {
    width: '100%',
  },
  labItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    margin: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  labItemWeb: {
    margin: 14,
    width: 420,
    minHeight: 180,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  },
  labTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  labText: {
    color: '#e0e0e0',
    fontSize: 15,
    marginBottom: 2,
  },
  requestButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 120,
    fontWeight: 'bold',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  requestItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    margin: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  requestText: {
    color: '#e0e0e0',
    fontSize: 15,
    marginBottom: 2,
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 120,
    fontWeight: 'bold',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    opacity: 0.7,
  },
});

export default HomeScreen;