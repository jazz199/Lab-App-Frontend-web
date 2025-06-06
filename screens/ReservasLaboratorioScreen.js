import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLabReservations, createLabReservation, updateLabReservation, deleteLabReservation, getLaboratories, getUsers } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native';

// Component to manage lab reservation records, displaying items side by side on web
const ReservasLaboratorioScreen = () => {
  // Get window width for responsive layout
  const { width } = useWindowDimensions();
  // State for reservations, laboratories, users, form visibility, and delete modal
  const [reservas, setReservas] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    laboratorio_id: '',
    usuario_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    proposito: '',
    estado: 'pendiente',
  });
  const [editingResId, setEditingResId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [resToDelete, setResToDelete] = useState(null);

  // Load reservation data from API
  const loadReservas = async () => {
    try {
      const data = await getLabReservations();
      setReservas(data);
    } catch (error) {
      console.error('Error en loadReservas:', error);
    }
  };

  // Load laboratories data from API
  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(data);
    } catch (error) {
      console.error('Error en loadLaboratories:', error);
    }
  };

  // Load users data from API
  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error en loadUsers:', error);
    }
  };

  // Open delete confirmation modal
  const handleDelete = (id) => {
    setResToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion and update state
  const confirmDelete = async () => {
    try {
      await deleteLabReservation(resToDelete);
      setReservas(reservas.filter(res => res.reserva_id !== resToDelete));
      setIsDeleteModalVisible(false);
      setResToDelete(null);
      Alert.alert("Éxito", "Reserva eliminada correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setResToDelete(null);
      Alert.alert("Error", "No se pudo eliminar la reserva");
    }
  };

  // Populate form for editing reservation
  const handleEdit = (res) => {
    setForm({
      laboratorio_id: res.laboratorio_id ? res.laboratorio_id.toString() : '',
      usuario_id: res.usuario_id ? res.usuario_id.toString() : '',
      fecha_inicio: res.fecha_inicio || '',
      fecha_fin: res.fecha_fin || '',
      proposito: res.proposito || '',
      estado: res.estado || 'pendiente',
    });
    setEditingResId(res.reserva_id);
    setIsFormVisible(true);
  };

  // Reset form and close it when canceling
  const handleCancel = () => {
    setForm({
      laboratorio_id: '',
      usuario_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      proposito: '',
      estado: 'pendiente',
    });
    setEditingResId(null);
    setIsFormVisible(false);
  };

  // Open form for new reservation with reset state
  const handleNewReservation = () => {
    setForm({
      laboratorio_id: '',
      usuario_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      proposito: '',
      estado: 'pendiente',
    });
    setEditingResId(null);
    setIsFormVisible(true);
  };

  // Submit form to create or update reservation
  const handleSubmit = async () => {
    try {
      const resData = {
        ...form,
        laboratorio_id: form.laboratorio_id ? parseInt(form.laboratorio_id) : null,
        usuario_id: form.usuario_id ? parseInt(form.usuario_id) : null,
      };
      if (editingResId) {
        await updateLabReservation(editingResId, resData);
        setReservas(reservas.map(res =>
          res.reserva_id === editingResId ? { ...res, ...resData } : res
        ));
        Alert.alert("Éxito", "Reserva actualizada correctamente");
      } else {
        const newRes = await createLabReservation(resData);
        setReservas([...reservas, newRes]);
        Alert.alert("Éxito", "Reserva creada correctamente");
      }
      setForm({
        laboratorio_id: '',
        usuario_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        proposito: '',
        estado: 'pendiente',
      });
      setIsFormVisible(false);
      setEditingResId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la reserva");
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadReservas();
    loadLaboratories();
    loadUsers();
  }, []);

  // Get laboratory name from ID
  const getLabName = (laboratorio_id) => {
    const lab = laboratories.find(l => l.laboratorio_id === parseInt(laboratorio_id));
    return lab ? lab.nombre : 'Sin laboratorio';
  };

  // Get user name from ID
  const getUserName = (usuario_id) => {
    const user = users.find(u => u.usuario_id === parseInt(usuario_id));
    return user ? `${user.nombre} ${user.apellido}` : 'Sin usuario';
  };

  // Responsive widths for container and reservation cards
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '95%';
  const resItemWidth = width > 1200 ? '30%' : width > 600 ? '45%' : '90%';

  // Render form for creating/editing reservations
  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {/* Form title */}
          <Text style={styles.title}>{editingResId ? "Editar Reserva" : "Nueva Reserva"}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.laboratorio_id}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, laboratorio_id: itemValue })}
            >
              <Picker.Item label="Seleccione laboratorio" value="" />
              {laboratories.map(lab => (
                <Picker.Item key={lab.laboratorio_id} label={lab.nombre} value={lab.laboratorio_id.toString()} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.usuario_id}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, usuario_id: itemValue })}
            >
              <Picker.Item label="Seleccione usuario" value="" />
              {users.map(user => (
                <Picker.Item key={user.usuario_id} label={`${user.nombre} ${user.apellido}`} value={user.usuario_id.toString()} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Fecha Inicio (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.fecha_inicio}
            onChangeText={(text) => setForm({ ...form, fecha_inicio: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Fin (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.fecha_fin}
            onChangeText={(text) => setForm({ ...form, fecha_fin: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Propósito"
            placeholderTextColor="#aaa"
            value={form.proposito}
            onChangeText={(text) => setForm({ ...form, proposito: text })}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.estado}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, estado: itemValue })}
            >
              <Picker.Item label="Pendiente" value="pendiente" />
              <Picker.Item label="Aprobada" value="aprobada" />
              <Picker.Item label="Cancelada" value="cancelada" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  // Render reservation list with side-by-side cards
  return (
    <Layout>
      {/* Header with title and new reservation button */}
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Reservas</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNewReservation}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        {/* Container for side-by-side reservation cards */}
        <View style={[styles.listContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {reservas.length === 0 ? (
            <Text style={styles.noDataText}>No hay reservas disponibles</Text>
          ) : (
            reservas.map((res, index) => (
              <View
                key={res.reserva_id?.toString() ?? `res-${index}`}
                style={[styles.resItem, { width: resItemWidth, marginHorizontal: '1%' }]}
              >
                {/* Reservation details */}
                <Text style={styles.itemTitle}>Reserva #{res.reserva_id}</Text>
                <Text style={styles.itemText}>Laboratorio: {getLabName(res.laboratorio_id)}</Text>
                <Text style={styles.itemText}>Usuario: {getUserName(res.usuario_id)}</Text>
                <Text style={styles.itemText}>Fecha Inicio: {res.fecha_inicio || 'No especificada'}</Text>
                <Text style={styles.itemText}>Fecha Fin: {res.fecha_fin || 'No especificada'}</Text>
                <Text style={styles.itemText}>Propósito: {res.proposito || 'Sin propósito'}</Text>
                <Text style={styles.itemText}>Estado: {res.estado || 'Sin estado'}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(res)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(res.reserva_id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/* Web-friendly delete confirmation modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar esta reserva?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalCancelButton} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalDeleteButton} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

// Styles matching EquipmentScreen.jsx, MantenimientoScreen.jsx, and PrestamosScreen.jsx, optimized for web and mobile
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row', // Arrange items side by side
    flexWrap: 'wrap', // Wrap to next row when needed
    justifyContent: 'space-between',
    width: '100%',
  },
  listScroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  resItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  itemTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    marginVertical: 3,
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 60, 0.95)',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#222',
  },
  picker: {
    color: '#fff',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 60, 0.95)',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
});

export default ReservasLaboratorioScreen;