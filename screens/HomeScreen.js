// FILE: screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Layout from '../components/layout';
import { getLaboratories, createLabReservation, updateLabReservation, updateLaboratory, getLabReservations } from '../api';

const HomeScreen = ({ route }) => {
  const user = route.params?.user || { tipo_usuario: 'estudiante', usuario_id: null }; // Obtenemos el usuario desde params
  const [laboratories, setLaboratories] = useState([]);
  const [requests, setRequests] = useState([]); // Solicitudes pendientes para el admin

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      const updatedLabs = data.map(lab => ({
        ...lab,
        ocupado: !!lab.responsable_id, // Consideramos ocupado si tiene responsable
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
  }, []);

  const renderLabItem = ({ item }) => (
    <View style={styles.labItem}>
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
    <View style={styles.requestItem}>
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
      />
      {user.tipo_usuario === 'admin' && requests.length > 0 && (
        <>
          <Text style={styles.title}>Solicitudes Pendientes</Text>
          <FlatList
            data={requests}
            keyExtractor={(item) => item.reserva_id.toString()}
            renderItem={renderRequestItem}
            style={styles.list}
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
  },
  list: {
    width: '100%',
  },
  labItem: {
    backgroundColor: '#333333',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  labTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  labText: {
    color: '#ffffff',
    fontSize: 14,
  },
  requestButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  requestItem: {
    backgroundColor: '#444444',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  requestText: {
    color: '#ffffff',
    fontSize: 14,
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;