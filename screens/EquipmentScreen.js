import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment, getLaboratories, getEquipmentCategories } from '../api';
import Layout from '../components/layout';

const { width, height } = Dimensions.get('window');

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
    estado: 'disponible',
    descripcion: '',
    fecha_adquisicion: '',
  });
  const [editingEquipId, setEditingEquipId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [equipToDelete, setEquipToDelete] = useState(null);

  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      console.log('Datos de equipos:', data); // Depuración
      const validData = data.filter(equip => equip.equipo_id !== undefined && equip.equipo_id !== null);
      setEquipment(validData);
    } catch (error) {
      console.error('Error en loadEquipment:', error);
    }
  };

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      console.log('Datos de laboratorios:', data); // Depuración
      const validData = data.filter(lab => lab.laboratorio_id !== undefined && lab.laboratorio_id !== null);
      setLaboratories(validData);
    } catch (error) {
      console.error('Error en loadLaboratories:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getEquipmentCategories();
      console.log('Datos de categorías:', data); // Depuración
      const validData = data.filter(cat => cat.categoria_id !== undefined && cat.categoria_id !== null);
      setCategories(validData);
    } catch (error) {
      console.error('Error en loadCategories:', error);
    }
  };

  const handleDelete = (id) => {
    setEquipToDelete(id);
    setIsDeleteModalVisible(true);
  };

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

  const handleNew = () => {
    setForm({
      nombre: '',
      codigo_inventario: '',
      categoria_id: '',
      laboratorio_id: '',
      estado: 'disponible',
      descripcion: '',
      fecha_adquisicion: '',
    });
    setEditingEquipId(null);
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
        const updatedEquip = await updateEquipment(editingEquipId, equipData);
        console.log('Equipo actualizado:', updatedEquip); // Depuración
        setEquipment(equipment.map(equip =>
          equip.equipo_id === editingEquipId ? { equipo_id: editingEquipId, ...equipData } : equip
        ));
        Alert.alert("Éxito", "Equipo actualizado correctamente");
      } else {
        const newEquip = await createEquipment(equipData);
        console.log('Nuevo equipo creado:', newEquip); // Depuración
        setEquipment([...equipment, newEquip]);
        Alert.alert("Éxito", "Equipo creado correctamente");
      }
      setForm({
        nombre: '',
        codigo_inventario: '',
        categoria_id: '',
        laboratorio_id: '',
        estado: 'disponible',
        descripcion: '',
        fecha_adquisicion: '',
      });
      setIsFormVisible(false);
      setEditingEquipId(null);
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      Alert.alert("Error", "No se pudo guardar el equipo");
    }
  };

  useEffect(() => {
    loadEquipment();
    loadLaboratories();
    loadCategories();
  }, []);

  const getCategoryName = (categoria_id) => {
    const category = categories.find(cat => cat.categoria_id === parseInt(categoria_id));
    return category ? category.nombre : 'Sin categoría';
  };

  const getLaboratoryName = (laboratorio_id) => {
    const lab = laboratories.find(lab => lab.laboratorio_id === parseInt(laboratorio_id));
    return lab ? lab.nombre : 'Sin laboratorio';
  };

  const isWeb = Platform.OS === 'web';
  const cardWidth = isWeb ? (width > 1200 ? 600 : width > 800 ? 500 : width > 600 ? 400 : '90%') : '90%';
  const containerWidth = isWeb ? (width > 1200 ? 1000 : width > 800 ? 800 : width > 600 ? 600 : '90%') : '100%';

  if (isFormVisible) {
    return (
      <Layout>
        
          <View style={[styles.formContainer, { width: cardWidth }]}>
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
                  <Picker.Item
                    key={cat.categoria_id.toString()}
                    label={cat.nombre}
                    value={cat.categoria_id.toString()}
                  />
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
                  <Picker.Item
                    key={lab.laboratorio_id.toString()}
                    label={lab.nombre}
                    value={lab.laboratorio_id.toString()}
                  />
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
      <View style={[styles.header, isWeb && { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Equipos</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNew}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, isWeb && { alignItems: 'center', paddingHorizontal: 10 }]}
        style={[isWeb && { maxHeight: height * 0.8, width: '100%' }]}
      >
        <View style={[styles.listContainer, { width: cardWidth }]}>
          {equipment.length === 0 ? (
            <Text style={styles.noDataText}>No hay equipos disponibles</Text>
          ) : (
            equipment.map((equip, index) => (
              <View
                key={equip.equipo_id?.toString() ?? `equip-${index}`}
                style={[styles.equipItem, isWeb && { width: cardWidth, marginHorizontal: 'auto' }]}
              >
                <Text style={styles.itemTitle}>{equip.nombre}</Text>
                <Text style={styles.itemText}>Código: {equip.codigo_inventario}</Text>
                <Text style={styles.itemText}>Categoría: {getCategoryName(equip.categoria_id)}</Text>
                <Text style={styles.itemText}>Laboratorio: {getLaboratoryName(equip.laboratorio_id)}</Text>
                <Text style={styles.itemText}>Estado: {equip.estado}</Text>
                <Text style={styles.itemText}>Descripción: {equip.descripcion || 'Sin descripción'}</Text>
                <Text style={styles.itemText}>Fecha de Adquisición: {equip.fecha_adquisicion || 'No especificada'}</Text>
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
    marginTop: 15,
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
    flex: 1,
    width: '100%',
    alignItems: 'center',
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
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
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
  formScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    minHeight: height * 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 60, 0.95)',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 600,
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
    borderRadius: 18,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
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