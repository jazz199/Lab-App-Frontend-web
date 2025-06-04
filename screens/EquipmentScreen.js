import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment, getLaboratories, getEquipmentCategories } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native';

// Component to manage equipment, displaying items side by side on web
const EquipmentScreen = () => {
  // Get window width for responsive layout
  const { width } = useWindowDimensions();
  const [equipment, setEquipment] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    codigo_inventario: '',
    categoria_id: '',
    laboratorio_id: '',
    estado: 'disponible',
    descripcion: '',
    fecha_adquisicion: '',
  });
  const [editingEquipId, setEditingEquipId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [equipToDelete, setEquipToDelete] = useState(null);

  // Load equipment data from API
  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
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

  // Load categories data from API
  const loadCategories = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error en loadCategories:', error);
    }
  };

  // Open delete confirmation modal
  const handleDelete = (id) => {
    setEquipToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion and update state
  const confirmDelete = async () => {
    try {
      await deleteEquipment(equipToDelete);
      setEquipment(equipment.filter(equip => equip.equipo_id !== equipToDelete));
      setIsDeleteModalVisible(false);
      setEquipToDelete(null);
      Alert.alert("Éxito", "Equipo eliminado correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setEquipToDelete(null);
      Alert.alert("Error", "No se pudo eliminar el equipo");
    }
  };

  // Populate form for editing equipment
  const handleEdit = (equip) => {
    setForm({
      nombre: equip.nombre || '',
      codigo_inventario: equip.codigo_inventario || '',
      categoria_id: equip.categoria_id ? equip.categoria_id.toString() : '',
      laboratorio_id: equip.laboratorio_id ? equip.laboratorio_id.toString() : '',
      estado: equip.estado || 'disponible',
      descripcion: equip.descripcion || '',
      fecha_adquisicion: equip.fecha_adquisicion || '',
    });
    setEditingEquipId(equip.equipo_id);
    setIsFormVisible(true);
  };

  // Submit form to create or update equipment
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

  // Load data on component mount
  useEffect(() => {
    loadEquipment();
    loadLaboratories();
    loadCategories();
  }, []);

  // Get category name from ID
  const getCategoryName = (categoria_id) => {
    const category = categories.find(cat => cat.categoria_id === parseInt(categoria_id));
    return category ? category.nombre : 'Sin categoría';
  };

  // Get laboratory name from ID
  const getLaboratoryName = (laboratorio_id) => {
    const lab = laboratories.find(lab => lab.laboratorio_id === parseInt(laboratorio_id));
    return lab ? lab.nombre : 'Sin laboratorio';
  };

  // Responsive widths for container and equipment cards
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '95%';
  const equipItemWidth = width > 1200 ? '30%' : width > 600 ? '45%' : '90%';

  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
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
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header with title and new equipment button */}
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Equipos</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        {/* Container for side-by-side equipment cards */}
        <View style={[styles.listContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {equipment.length === 0 ? (
            <Text style={styles.noDataText}>No hay equipos disponibles</Text>
          ) : (
            equipment.map((equip, index) => (
              <View
                key={equip.equipo_id?.toString() ?? `equip-${index}`}
                style={[styles.equipItem, { width: equipItemWidth, marginHorizontal: '1%' }]}
              >
                <Text style={styles.itemTitle}>{equip.nombre}</Text>
                <Text style={styles.itemText}>Código: {equip.codigo_inventario}</Text>
                <Text style={styles.itemText}>Categoría: {getCategoryName(equip.categoria_id)}</Text>
                <Text style={styles.itemText}>Laboratorio: {getLaboratoryName(equip.laboratorio_id)}</Text>
                <Text style={styles.itemText}>Estado: {equip.estado}</Text>
                <Text style={styles.itemText}>Descripción: {equip.descripcion || 'Sin descripción'}</Text>
                {/* <Text style={styles.itemText}>Fecha de Adquisición: {equip.fecha_adquisicion || 'No especificada'}</Text> */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(equip)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(equip.equipo_id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/* Delete confirmation modal for web-friendly UI */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar este equipo?</Text>
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
  equipItem: {
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

export default EquipmentScreen;