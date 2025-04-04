// FILE: screens/LaboratoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLaboratories, createLaboratory, updateLaboratory, deleteLaboratory, getUsers } from '../api';
import Layout from '../components/layout';
import LaboratoryList from '../components/LaboratoryList';

const LaboratoryScreen = () => {
  const [laboratories, setLaboratories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    tipo_laboratorio: 'electronica',
    capacidad: '',
    responsable_id: '',
  });
  const [editingLabId, setEditingLabId] = useState(null);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      const validData = data.filter(lab => lab.laboratorio_id !== undefined && lab.laboratorio_id !== null);
      setLaboratories(validData);
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
    Alert.alert("Confirmar", "¿Estás seguro de que quieres eliminar este laboratorio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteLaboratory(id);
            setLaboratories(laboratories.filter(lab => lab.laboratorio_id !== id));
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el laboratorio");
          }
        },
      },
    ]);
  };

  const handleEdit = (lab) => {
    setForm({
      nombre: lab.nombre || '',
      ubicacion: lab.ubicacion || '',
      tipo_laboratorio: lab.tipo_laboratorio || 'electronica',
      capacidad: lab.capacidad !== undefined && lab.capacidad !== null ? lab.capacidad.toString() : '',
      responsable_id: lab.responsable_id !== undefined && lab.responsable_id !== null ? lab.responsable_id.toString() : '',
    });
    setEditingLabId(lab.laboratorio_id);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const labData = {
        ...form,
        capacidad: form.capacidad ? parseInt(form.capacidad) : null,
        responsable_id: form.responsable_id ? parseInt(form.responsable_id) : null,
      };
      if (editingLabId) {
        await updateLaboratory(editingLabId, labData);
        setLaboratories(laboratories.map(lab =>
          lab.laboratorio_id === editingLabId ? { ...lab, ...labData } : lab
        ));
        Alert.alert("Éxito", "Laboratorio actualizado correctamente");
      } else {
        const newLab = await createLaboratory(labData);
        console.log('Nuevo laboratorio creado:', newLab); // Depuración
        setLaboratories([...laboratories, newLab]);
        Alert.alert("Éxito", "Laboratorio creado correctamente");
      }
      setForm({ nombre: '', ubicacion: '', tipo_laboratorio: 'electronica', capacidad: '', responsable_id: '' });
      setIsFormVisible(false);
      setEditingLabId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el laboratorio");
    }
  };

  useEffect(() => {
    loadLaboratories();
    loadUsers();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
        <Text style={styles.title}>{editingLabId ? "Editar Laboratorio" : "Nuevo Laboratorio"}</Text>
        <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#aaa" value={form.nombre} onChangeText={(text) => setForm({ ...form, nombre: text })} />
        <TextInput style={styles.input} placeholder="Ubicación" placeholderTextColor="#aaa" value={form.ubicacion} onChangeText={(text) => setForm({ ...form, ubicacion: text })} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={form.tipo_laboratorio} style={styles.picker} onValueChange={(itemValue) => setForm({ ...form, tipo_laboratorio: itemValue })}>
            <Picker.Item label="Electrónica" value="electronica" />
            <Picker.Item label="Hardware" value="hardware" />
            <Picker.Item label="Telecomunicaciones" value="telecomunicaciones" />
            <Picker.Item label="Redes" value="redes" />
          </Picker>
        </View>
        <TextInput style={styles.input} placeholder="Capacidad" placeholderTextColor="#aaa" value={form.capacidad} keyboardType="numeric" onChangeText={(text) => setForm({ ...form, capacidad: text })} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={form.responsable_id} style={styles.picker} onValueChange={(itemValue) => setForm({ ...form, responsable_id: itemValue })}>
            <Picker.Item label="Sin responsable" value="" />
            {users.map(user => (
              <Picker.Item key={user.usuario_id} label={`${user.nombre} ${user.apellido}`} value={user.usuario_id.toString()} />
            ))}
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

  console.log('Estado de laboratories antes de FlatList:', laboratories);
  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>Laboratorios</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <LaboratoryList laboratories={laboratories} onDelete={handleDelete} onEdit={handleEdit} />
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

export default LaboratoryScreen;