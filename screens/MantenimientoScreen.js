// FILE: screens/MantenimientoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getMaintenaint, createMaintenance, updateMaintenance, deleteMaintenance, getEquipment } from '../api';
import Layout from '../components/layout';
import MantenimientoList from '../components/MantenimientoList';

const MantenimientoScreen = () => {
  const [mantenimiento, setMantenimiento] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    equipo_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
    tecnico: '',
    costo: '',
  });
  const [editingMaintId, setEditingMaintId] = useState(null);

  const loadMaintenaint = async () => {
    try {
      const data = await getMaintenaint();
      setMantenimiento(data);
    } catch (error) {
      console.error('Error en loadMaintenaint:', error);
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
    Alert.alert("Confirmar", "¿Seguro de eliminar este mantenimiento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteMaintenance(id);
            setMantenimiento(mantenimiento.filter(maint => maint.mantenimiento_id !== id));
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el mantenimiento");
          }
        },
      },
    ]);
  };

  const handleEdit = (maint) => {
    setForm({
      equipo_id: maint.equipo_id ? maint.equipo_id.toString() : '',
      fecha_inicio: maint.fecha_inicio || '',
      fecha_fin: maint.fecha_fin || '',
      descripcion: maint.descripcion || '',
      tecnico: maint.tecnico || '',
      costo: maint.costo ? maint.costo.toString() : '',
    });
    setEditingMaintId(maint.mantenimiento_id);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const maintData = {
        ...form,
        equipo_id: form.equipo_id ? parseInt(form.equipo_id) : null,
        costo: form.costo ? parseFloat(form.costo) : null,
      };
      if (editingMaintId) {
        await updateMaintenance(editingMaintId, maintData);
        setMantenimiento(mantenimiento.map(maint =>
          maint.mantenimiento_id === editingMaintId ? { ...maint, ...maintData } : maint
        ));
        Alert.alert("Éxito", "Mantenimiento actualizado correctamente");
      } else {
        const newMaint = await createMaintenance(maintData);
        setMantenimiento([...mantenimiento, newMaint]);
        Alert.alert("Éxito", "Mantenimiento creado correctamente");
      }
      setForm({ equipo_id: '', fecha_inicio: '', fecha_fin: '', descripcion: '', tecnico: '', costo: '' });
      setIsFormVisible(false);
      setEditingMaintId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el mantenimiento");
    }
  };

  useEffect(() => {
    loadMaintenaint();
    loadEquipment();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
        <Text style={styles.title}>{editingMaintId ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}</Text>
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
          placeholder="Descripción"
          placeholderTextColor="#aaa"
          value={form.descripcion}
          onChangeText={(text) => setForm({ ...form, descripcion: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Técnico"
          placeholderTextColor="#aaa"
          value={form.tecnico}
          onChangeText={(text) => setForm({ ...form, tecnico: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Costo"
          placeholderTextColor="#aaa"
          value={form.costo}
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, costo: text })}
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
        <Text style={styles.title}>Mantenimiento</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <MantenimientoList mantenimiento={mantenimiento} onDelete={handleDelete} onEdit={handleEdit} />
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

export default MantenimientoScreen;