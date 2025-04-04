// FILE: screens/EquipmentScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment, getLaboratories, getEquipmentCategories } from '../api';
import Layout from '../components/layout';
import EquipmentList from '../components/EquipmentList';

const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    codigo_inventario: '',
    categoria_id: '',
    laboratorio_id: '',
    estado: 'disponible', // Valor por defecto
    descripcion: '',
    fecha_adquisicion: '',
  });
  const [editingEquipId, setEditingEquipId] = useState(null);

  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
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

  const loadCategories = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error en loadCategories:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres eliminar este equipo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteEquipment(id);
              setEquipment(equipment.filter(equip => equip.equipo_id !== id));
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el equipo");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (equip) => {
    setForm({
      nombre: equip.nombre,
      codigo_inventario: equip.codigo_inventario,
      categoria_id: equip.categoria_id ? equip.categoria_id.toString() : '',
      laboratorio_id: equip.laboratorio_id ? equip.laboratorio_id.toString() : '',
      estado: equip.estado || 'disponible',
      descripcion: equip.descripcion,
      fecha_adquisicion: equip.fecha_adquisicion || '',
    });
    setEditingEquipId(equip.equipo_id);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const equipData = {
        ...form,
        categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
        laboratorio_id: form.laboratorio_id ? parseInt(form.laboratorio_id) : null,
      };
      if (editingEquipId) {
        await updateEquipment(editingEquipId, equipData);
        setEquipment(equipment.map(equip =>
          equip.equipo_id === editingEquipId ? { ...equip, ...equipData } : equip
        ));
        Alert.alert("Éxito", "Equipo actualizado correctamente");
      } else {
        const newEquip = await createEquipment(equipData);
        setEquipment([...equipment, newEquip]);
        Alert.alert("Éxito", "Equipo creado correctamente");
      }
      setForm({ nombre: '', codigo_inventario: '', categoria_id: '', laboratorio_id: '', estado: 'disponible', descripcion: '', fecha_adquisicion: '' });
      setIsFormVisible(false);
      setEditingEquipId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el equipo");
    }
  };

  useEffect(() => {
    loadEquipment();
    loadLaboratories();
    loadCategories();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
        <Text style={styles.title}>{editingEquipId ? "Editar Equipo" : "Nuevo Equipo"}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#aaa"
          value={form.nombre}
          onChangeText={(text) => setForm({ ...form, nombre: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Código de Inventario"
          placeholderTextColor="#aaa"
          value={form.codigo_inventario}
          onChangeText={(text) => setForm({ ...form, codigo_inventario: text })}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.categoria_id}
            style={styles.picker}
            onValueChange={(itemValue) => setForm({ ...form, categoria_id: itemValue })}
          >
            <Picker.Item label="Sin categoría" value="" />
            {categories.map(cat => (
              <Picker.Item key={cat.categoria_id} label={cat.nombre} value={cat.categoria_id.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.laboratorio_id}
            style={styles.picker}
            onValueChange={(itemValue) => setForm({ ...form, laboratorio_id: itemValue })}
          >
            <Picker.Item label="Sin laboratorio" value="" />
            {laboratories.map(lab => (
              <Picker.Item key={lab.laboratorio_id} label={lab.nombre} value={lab.laboratorio_id.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.estado}
            style={styles.picker}
            onValueChange={(itemValue) => setForm({ ...form, estado: itemValue })}
          >
            <Picker.Item label="Disponible" value="disponible" />
            <Picker.Item label="En uso" value="en_uso" />
            <Picker.Item label="En mantenimiento" value="en_mantenimiento" />
            <Picker.Item label="Dado de baja" value="dado_de_baja" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor="#aaa"
          value={form.descripcion}
          onChangeText={(text) => setForm({ ...form, descripcion: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de Adquisición (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={form.fecha_adquisicion}
          onChangeText={(text) => setForm({ ...form, fecha_adquisicion: text })}
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
        <Text style={styles.title}>Equipos</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <EquipmentList equipment={equipment} onDelete={handleDelete} onEdit={handleEdit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
  },
  newButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
  },
  picker: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EquipmentScreen;