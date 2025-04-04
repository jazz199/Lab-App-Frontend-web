// FILE: screens/ReservasLaboratorioScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLabReservations, createLabReservation, updateLabReservation, deleteLabReservation, getLaboratories, getUsers } from '../api';
import Layout from '../components/layout';
import ReservasLaboratorioList from '../components/ReservaLaboratorioList';

const ReservasLaboratorioScreen = () => {
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
    estado: 'pendiente', // Valor por defecto
  });
  const [editingResId, setEditingResId] = useState(null);

  const loadReservas = async () => {
    try {
      const data = await getLabReservations();
      setReservas(data);
    } catch (error) {
      console.error('Error en loadReservas:', error);
    }
  };

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(data);
    } catch (error) {
      console.error('Error en loadLaboratories:', error);
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

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "¿Seguro de eliminar esta reserva?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteLabReservation(id);
            setReservas(reservas.filter(res => res.reserva_id !== id));
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar la reserva");
          }
        },
      },
    ]);
  };

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
      setForm({ laboratorio_id: '', usuario_id: '', fecha_inicio: '', fecha_fin: '', proposito: '', estado: 'pendiente' });
      setIsFormVisible(false);
      setEditingResId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la reserva");
    }
  };

  useEffect(() => {
    loadReservas();
    loadLaboratories();
    loadUsers();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
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
        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsFormVisible(false)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>Reservas de Laboratorio</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ReservasLaboratorioList reservas={reservas} onDelete={handleDelete} onEdit={handleEdit} />
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

export default ReservasLaboratorioScreen;