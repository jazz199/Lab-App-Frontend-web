import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { getEquipmentCategories, createEquipmentCategory, updateEquipmentCategory, deleteEquipmentCategory } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native';

// Component to manage equipment category records, displaying items side by side on web
const CategoriaEquiposScreen = () => {
  // Get window width for responsive layout
  const { width } = useWindowDimensions();
  // State for categories, form visibility, and delete modal
  const [categorias, setCategorias] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editingCatId, setEditingCatId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  // Load category data from API
  const loadCategorias = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Error en loadCategorias:', error);
    }
  };

  // Open delete confirmation modal
  const handleDelete = (id) => {
    setCatToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion and update state
  const confirmDelete = async () => {
    try {
      await deleteEquipmentCategory(catToDelete);
      setCategorias(categorias.filter(cat => cat.categoria_id !== catToDelete));
      setIsDeleteModalVisible(false);
      setCatToDelete(null);
      Alert.alert("Éxito", "Categoría eliminada correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setCatToDelete(null);
      Alert.alert("Error", "No se pudo eliminar la categoría");
    }
  };

  // Populate form for editing category
  const handleEdit = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setEditingCatId(cat.categoria_id);
    setIsFormVisible(true);
  };

  // Reset form and close it when canceling
  const handleCancel = () => {
    setForm({ nombre: '', descripcion: '' });
    setEditingCatId(null);
    setIsFormVisible(false);
  };

  // Open form for new category with reset state
  const handleNewCategory = () => {
    setForm({ nombre: '', descripcion: '' });
    setEditingCatId(null);
    setIsFormVisible(true);
  };

  // Submit form to create or update category
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

  // Load data on component mount
  useEffect(() => {
    loadCategorias();
  }, []);

  // Responsive widths for container and category cards
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '95%';
  const catItemWidth = width > 1200 ? '30%' : width > 600 ? '45%' : '90%';

  // Render form for creating/editing categories
  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {/* Form title */}
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
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  // Render category list with side-by-side cards
  return (
    <Layout>
      {/* Header with title and new category button */}
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Categorías</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNewCategory}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        {/* Container for side-by-side category cards */}
        <View style={[styles.listContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {categorias.length === 0 ? (
            <Text style={styles.noDataText}>No hay categorías disponibles</Text>
          ) : (
            categorias.map((cat, index) => (
              <View
                key={cat.categoria_id?.toString() ?? `cat-${index}`}
                style={[styles.catItem, { width: catItemWidth, marginHorizontal: '1%' }]}
              >
                {/* Category details */}
                <Text style={styles.itemTitle}>Categoría #{cat.categoria_id}</Text>
                <Text style={styles.itemText}>Nombre: {cat.nombre || 'Sin nombre'}</Text>
                <Text style={styles.itemText}>Descripción: {cat.descripcion || 'Sin descripción'}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(cat)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(cat.categoria_id)}>
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
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar esta categoría?</Text>
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

// Styles matching EquipmentScreen.jsx, MantenimientoScreen.jsx, PrestamosScreen.jsx, and ReservasLaboratorioScreen.jsx, optimized for web and mobile
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
  catItem: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fixed: Complete rgba value
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

export default CategoriaEquiposScreen;