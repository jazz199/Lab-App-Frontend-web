// FILE: screens/CategoriaEquiposScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { getEquipmentCategories, createEquipmentCategory, updateEquipmentCategory, deleteEquipmentCategory } from '../api';
import Layout from '../components/layout';
import CategoriaEquiposList from '../components/CategoriaEquiposList';

const CategoriaEquiposScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editingCatId, setEditingCatId] = useState(null);

  const loadCategorias = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Error en loadCategorias:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "¿Seguro de eliminar esta categoría?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteEquipmentCategory(id);
            setCategorias(categorias.filter(cat => cat.categoria_id !== id));
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar la categoría");
          }
        },
      },
    ]);
  };

  const handleEdit = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setEditingCatId(cat.categoria_id);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCatId) {
        await updateEquipmentCategory(editingCatId, form);
        setCategorias(categorias.map(cat =>
          cat.categoria_id === editingCatId ? { ...cat, ...form } : cat
        ));
        Alert.alert("Éxito", "Categoría actualizada correctamente");
      } else {
        const newCat = await createEquipmentCategory(form);
        setCategorias([...categorias, newCat]);
        Alert.alert("Éxito", "Categoría creada correctamente");
      }
      setForm({ nombre: '', descripcion: '' });
      setIsFormVisible(false);
      setEditingCatId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la categoría");
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  if (isFormVisible) {
    return (
      <Layout>
        <Text style={styles.title}>{editingCatId ? "Editar Categoría" : "Nueva Categoría"}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#aaa"
          value={form.nombre}
          onChangeText={(text) => setForm({ ...form, nombre: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor="#aaa"
          value={form.descripcion}
          onChangeText={(text) => setForm({ ...form, descripcion: text })}
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
        <Text style={styles.title}>Categorías de Equipos</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <CategoriaEquiposList categorias={categorias} onDelete={handleDelete} onEdit={handleEdit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
  title: { color: '#ffffff', fontSize: 20 },
  newButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 5 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, width: '80%' },
  submitButton: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
  cancelButton: { backgroundColor: '#ff4444', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default CategoriaEquiposScreen;