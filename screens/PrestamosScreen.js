import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLoans, createLoan, updateLoan, deleteLoan, getUsers, getEquipment } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native';

// Component to manage loan records, displaying items side by side on web
const PrestamosScreen = () => {
  // Get window width for responsive layout
  const { width } = useWindowDimensions();
  // State for loans, users, equipment, form visibility, and delete modal
  const [prestamos, setPrestamos] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    usuario_id: '',
    equipo_id: '',
    fecha_prestamo: '',
    fecha_devolucion_prevista: '',
    fecha_devolucion_real: '',
    estado: 'activo',
    notas: '',
  });
  const [editingLoanId, setEditingLoanId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  // Load loan data from API
  const loadPrestamos = async () => {
    try {
      const data = await getLoans();
      setPrestamos(data);
    } catch (error) {
      console.error('Error en loadPrestamos:', error);
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

  // Load equipment data from API
  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
    }
  };

  // Open delete confirmation modal
  const handleDelete = (id) => {
    setLoanToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion and update state
  const confirmDelete = async () => {
    try {
      await deleteLoan(loanToDelete);
      setPrestamos(prestamos.filter(loan => loan.prestamo_id !== loanToDelete));
      setIsDeleteModalVisible(false);
      setLoanToDelete(null);
      Alert.alert("Éxito", "Préstamo eliminado correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setLoanToDelete(null);
      Alert.alert("Error", "No se pudo eliminar el préstamo");
    }
  };

  // Populate form for editing loan
  const handleEdit = (loan) => {
    setForm({
      usuario_id: loan.usuario_id ? loan.usuario_id.toString() : '',
      equipo_id: loan.equipo_id ? loan.equipo_id.toString() : '',
      fecha_prestamo: loan.fecha_prestamo || '',
      fecha_devolucion_prevista: loan.fecha_devolucion_prevista || '',
      fecha_devolucion_real: loan.fecha_devolucion_real || '',
      estado: loan.estado || 'activo',
      notas: loan.notas || '',
    });
    setEditingLoanId(loan.prestamo_id);
    setIsFormVisible(true);
  };

  // Reset form and close it when canceling
  const handleCancel = () => {
    setForm({
      usuario_id: '',
      equipo_id: '',
      fecha_prestamo: '',
      fecha_devolucion_prevista: '',
      fecha_devolucion_real: '',
      estado: 'activo',
      notas: '',
    });
    setEditingLoanId(null);
    setIsFormVisible(false);
  };

  // Open form for new loan with reset state
  const handleNewLoan = () => {
    setForm({
      usuario_id: '',
      equipo_id: '',
      fecha_prestamo: '',
      fecha_devolucion_prevista: '',
      fecha_devolucion_real: '',
      estado: 'activo',
      notas: '',
    });
    setEditingLoanId(null);
    setIsFormVisible(true);
  };

  // Submit form to create or update loan
  const handleSubmit = async () => {
    try {
      const loanData = {
        ...form,
        usuario_id: form.usuario_id ? parseInt(form.usuario_id) : null,
        equipo_id: form.equipo_id ? parseInt(form.equipo_id) : null,
      };
      if (editingLoanId) {
        await updateLoan(editingLoanId, loanData);
        setPrestamos(prestamos.map(loan =>
          loan.prestamo_id === editingLoanId ? { ...loan, ...loanData } : loan
        ));
        Alert.alert("Éxito", "Préstamo actualizado correctamente");
      } else {
        const newLoan = await createLoan(loanData);
        setPrestamos([...prestamos, newLoan]);
        Alert.alert("Éxito", "Préstamo creado correctamente");
      }
      setForm({
        usuario_id: '',
        equipo_id: '',
        fecha_prestamo: '',
        fecha_devolucion_prevista: '',
        fecha_devolucion_real: '',
        estado: 'activo',
        notas: '',
      });
      setIsFormVisible(false);
      setEditingLoanId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el préstamo");
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPrestamos();
    loadUsers();
    loadEquipment();
  }, []);

  // Get user name from ID
  const getUserName = (usuario_id) => {
    const user = users.find(u => u.usuario_id === parseInt(usuario_id));
    return user ? `${user.nombre} ${user.apellido}` : 'Sin usuario';
  };

  // Get equipment name from ID
  const getEquipmentName = (equipo_id) => {
    const equip = equipment.find(e => e.equipo_id === parseInt(equipo_id));
    return equip ? equip.nombre : 'Sin equipo';
  };

  // Responsive widths for container and loan cards
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '95%';
  const loanItemWidth = width > 1200 ? '30%' : width > 600 ? '45%' : '90%';

  // Render form for creating/editing loans
  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {/* Form title */}
          <Text style={styles.title}>{editingLoanId ? "Editar Préstamo" : "Nuevo Préstamo"}</Text>
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.equipo_id}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, equipo_id: itemValue })}
            >
              <Picker.Item label="Seleccione equipo" value="" />
              {equipment.map(equip => (
                <Picker.Item key={equip.equipo_id} label={equip.nombre} value={equip.equipo_id.toString()} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Fecha Préstamo (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.fecha_prestamo}
            onChangeText={(text) => setForm({ ...form, fecha_prestamo: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Devolución Prevista (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.fecha_devolucion_prevista}
            onChangeText={(text) => setForm({ ...form, fecha_devolucion_prevista: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Devolución Real (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.fecha_devolucion_real}
            onChangeText={(text) => setForm({ ...form, fecha_devolucion_real: text })}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.estado}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, estado: itemValue })}
            >
              <Picker.Item label="Activo" value="activo" />
              <Picker.Item label="Devuelto" value="devuelto" />
              <Picker.Item label="Atrasado" value="atrasado" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Notas"
            placeholderTextColor="#aaa"
            value={form.notas}
            onChangeText={(text) => setForm({ ...form, notas: text })}
          />
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

  // Render loan list with side-by-side cards
  return (
    <Layout>
      {/* Header with title and new loan button */}
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Préstamos</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNewLoan}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        {/* Container for side-by-side loan cards */}
        <View style={[styles.listContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {prestamos.length === 0 ? (
            <Text style={styles.noDataText}>No hay préstamos disponibles</Text>
          ) : (
            prestamos.map((loan, index) => (
              <View
                key={loan.prestamo_id?.toString() ?? `loan-${index}`}
                style={[styles.loanItem, { width: loanItemWidth, marginHorizontal: '1%' }]}
              >
                {/* Loan details */}
                <Text style={styles.itemTitle}>Préstamo #{loan.prestamo_id}</Text>
                <Text style={styles.itemText}>Usuario: {getUserName(loan.usuario_id)}</Text>
                <Text style={styles.itemText}>Equipo: {getEquipmentName(loan.equipo_id)}</Text>
                <Text style={styles.itemText}>Fecha Préstamo: {loan.fecha_prestamo || 'No especificada'}</Text>
                <Text style={styles.itemText}>Fecha Devolución Prevista: {loan.fecha_devolucion_prevista || 'No especificada'}</Text>
                <Text style={styles.itemText}>Fecha Devolución Real: {loan.fecha_devolucion_real || 'No especificada'}</Text>
                <Text style={styles.itemText}>Estado: {loan.estado || 'Sin estado'}</Text>
                <Text style={styles.itemText}>Notas: {loan.notas || 'Sin notas'}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(loan)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(loan.prestamo_id)}>
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
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar este préstamo?</Text>
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

// Styles matching EquipmentScreen.jsx and MantenimientoScreen.jsx, optimized for web and mobile
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
  loanItem: {
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

export default PrestamosScreen;