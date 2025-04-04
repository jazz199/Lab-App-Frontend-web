// FILE: screens/PrestamosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLoans, createLoan, updateLoan, deleteLoan, getUsers, getEquipment } from '../api';
import Layout from '../components/layout';
import PrestamosList from '../components/PrestamosList';

const PrestamosScreen = () => {
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
    estado: 'activo', // Valor por defecto
    notas: '',
  });
  const [editingLoanId, setEditingLoanId] = useState(null);

  const loadPrestamos = async () => {
    try {
      const data = await getLoans();
      setPrestamos(data);
    } catch (error) {
      console.error('Error en loadPrestamos:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error en loadUsers:', error);
    }
  };

  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "¿Seguro de eliminar este préstamo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteLoan(id);
            setPrestamos(prestamos.filter(loan => loan.prestamo_id !== id));
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el préstamo");
          }
        },
      },
    ]);
  };

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
      setForm({ usuario_id: '', equipo_id: '', fecha_prestamo: '', fecha_devolucion_prevista: '', fecha_devolucion_real: '', estado: 'activo', notas: '' });
      setIsFormVisible(false);
      setEditingLoanId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el préstamo");
    }
  };

  useEffect(() => {
    loadPrestamos();
    loadUsers();
    loadEquipment();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
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
        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsFormVisible(false)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>Préstamos</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <PrestamosList prestamos={prestamos} onDelete={handleDelete} onEdit={handleEdit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
  title: { color: '#ffffff', fontSize: 20 },
  newButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 5 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, width: '80%' },
  pickerContainer: { backgroundColor: '#333', borderRadius: 5, marginVertical: 5, width: '80%' },
  picker: { color: '#fff' },
  submitButton: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
  cancelButton: { backgroundColor: '#ff4444', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default PrestamosScreen;