import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getMaintenaint, createMaintenance, updateMaintenance, deleteMaintenance, getEquipment } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native';

// Component to manage maintenance records, displaying items side by side on web
const MantenimientoScreen = () => {
  // Get window width for responsive layout
  const { width } = useWindowDimensions();
  // State for maintenance records, equipment list, form visibility, and delete modal
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [maintToDelete, setMaintToDelete] = useState(null);

  // Load maintenance data from API
  const loadMaintenance = async () => {
    try {
      const data = await getMaintenaint();
      setMantenimiento(data);
    } catch (error) {
      console.error('Error en loadMaintenance:', error);
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
    setMaintToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion and update state
  const confirmDelete = async () => {
    try {
      await deleteMaintenance(maintToDelete);
      setMantenimiento(mantenimiento.filter(maint => maint.mantenimiento_id !== maintToDelete));
      setIsDeleteModalVisible(false);
      setMaintToDelete(null);
      Alert.alert("Éxito", "Mantenimiento eliminado correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setMaintToDelete(null);
      Alert.alert("Error", "No se pudo eliminar el mantenimiento");
    }
  };

  // Populate form for editing maintenance
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

  // Submit form to create or update maintenance
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

  // Load data on component mount
  useEffect(() => {
    loadMaintenance();
    loadEquipment();
  }, []);

  // Get equipment name from ID
  const getEquipmentName = (equipo_id) => {
    const equip = equipment.find(e => e.equipo_id === parseInt(equipo_id));
    return equip ? equip.nombre : 'Sin equipo';
  };

  // Responsive widths for container and maintenance cards
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '95%';
  const maintItemWidth = width > 1200 ? '30%' : width > 600 ? '45%' : '90%';

  // Render form for creating/editing maintenance
  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {/* Form title */}
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
        </View>
      </Layout>
    );
  }

  // Render maintenance list with side-by-side cards
  return (
    <Layout>
      {/* Header with title and new maintenance button */}
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Mantenimiento</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        {/* Container for side-by-side maintenance cards */}
        <View style={[styles.listContainer, { width: containerWidth, marginHorizontal: 'auto' }]}>
          {mantenimiento.length === 0 ? (
            <Text style={styles.noDataText}>No hay mantenimientos disponibles</Text>
          ) : (
            mantenimiento.map((maint, index) => (
              <View
                key={maint.mantenimiento_id?.toString() ?? `maint-${index}`}
                style={[styles.maintItem, { width: maintItemWidth, marginHorizontal: '1%' }]}
              >
                {/* Maintenance details */}
                <Text style={styles.itemTitle}>Mantenimiento #{maint.mantenimiento_id}</Text>
                <Text style={styles.itemText}>Equipo: {getEquipmentName(maint.equipo_id)}</Text>
                <Text style={styles.itemText}>Fecha Inicio: {maint.fecha_inicio || 'No especificada'}</Text>
                <Text style={styles.itemText}>Fecha Fin: {maint.fecha_fin || 'No especificada'}</Text>
                <Text style={styles.itemText}>Descripción: {maint.descripcion || 'Sin descripción'}</Text>
                <Text style={styles.itemText}>Técnico: {maint.tecnico || 'Sin técnico'}</Text>
                <Text style={styles.itemText}>Costo: {maint.costo ? `$${maint.costo}` : 'Sin costo'}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(maint)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(maint.mantenimiento_id)}>
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
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar este mantenimiento?</Text>
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

// Styles matching EquipmentScreen.jsx, optimized for web and mobile
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
  maintItem: {
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

export default MantenimientoScreen;