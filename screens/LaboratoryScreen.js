// LaboratoryScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getLaboratories, createLaboratory, updateLaboratory, deleteLaboratory, getUsers } from '../api';
import Layout from '../components/layout';
import { useWindowDimensions } from 'react-native'; // Replaces Dimensions for better web support

const LaboratoryScreen = () => {
  const { width } = useWindowDimensions(); // Use for responsive design
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [labToDelete, setLabToDelete] = useState(null);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      console.log('Datos de laboratorios:', data);
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

  const handleDelete = (id) => {
    setLabToDelete(id);
    setIsDeleteModalVisible(true); // Show custom modal for web
  };

  const confirmDelete = async () => {
    try {
      await deleteLaboratory(labToDelete);
      setLaboratories(laboratories.filter(lab => lab.laboratorio_id !== labToDelete));
      setIsDeleteModalVisible(false);
      setLabToDelete(null);
      Alert.alert("Éxito", "Laboratorio eliminado correctamente");
    } catch (error) {
      setIsDeleteModalVisible(false);
      setLabToDelete(null);
      Alert.alert("Error", "No se pudo eliminar el laboratorio");
    }
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

  const handleNew = () => {
    setForm({
      nombre: '',
      ubicacion: '',
      tipo_laboratorio: 'electronica',
      capacidad: '',
      responsable_id: '',
    });
    setEditingLabId(null);
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
        const updatedLab = await updateLaboratory(editingLabId, labData);
        console.log('Laboratorio actualizado:', updatedLab);
        setLaboratories(laboratories.map(lab =>
          lab.laboratorio_id === editingLabId ? { laboratorio_id: editingLabId, ...labData } : lab
        ));
        Alert.alert("Éxito", "Laboratorio actualizado correctamente");
      } else {
        const newLab = await createLaboratory(labData);
        console.log('Nuevo laboratorio creado:', newLab);
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

  const getResponsibleName = (responsable_id) => {
    const user = users.find(u => u.usuario_id === parseInt(responsable_id));
    return user ? `${user.nombre} ${user.apellido}` : 'Sin responsable';
  };

  // Responsive widths for web and mobile
  const cardWidth = width > 1200 ? '600px' : width > 800 ? '500px' : width > 600 ? '400px' : '90%';
  const containerWidth = width > 1200 ? '1000px' : width > 800 ? '800px' : width > 600 ? '600px' : '90%';

  if (isFormVisible) {
    return (
      <Layout>
        <View style={[styles.formContainer, { width: cardWidth }]}>
          <Text style={styles.title}>{editingLabId ? "Editar Laboratorio" : "Nuevo Laboratorio"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={form.nombre}
            onChangeText={(text) => setForm({ ...form, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            placeholderTextColor="#aaa"
            value={form.ubicacion}
            onChangeText={(text) => setForm({ ...form, ubicacion: text })}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.tipo_laboratorio}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, tipo_laboratorio: itemValue })}
            >
              <Picker.Item label="Electrónica" value="electronica" />
              <Picker.Item label="Hardware" value="hardware" />
              <Picker.Item label="Telecomunicaciones" value="telecomunicaciones" />
              <Picker.Item label="Redes" value="redes" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Capacidad"
            placeholderTextColor="#aaa"
            value={form.capacidad}
            keyboardType="numeric"
            onChangeText={(text) => setForm({ ...form, capacidad: text })}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.responsable_id}
              style={styles.picker}
              onValueChange={(itemValue) => setForm({ ...form, responsable_id: itemValue })}
            >
              <Picker.Item label="Sin responsable" value="" />
              {users.map(user => (
                <Picker.Item
                  key={user.usuario_id.toString()}
                  label={`${user.nombre} ${user.apellido}`}
                  value={user.usuario_id.toString()}
                />
              ))}
            </Picker>
          </View>
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
      <View style={[styles.header, { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Laboratorios</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNew}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, { alignItems: 'center', paddingHorizontal: 10 }]}
        style={{ maxHeight: '80vh', width: '100%' }}
      >
        <View style={[styles.listContainer, { width: containerWidth }]}>
          {laboratories.length === 0 ? (
            <Text style={styles.noDataText}>No hay laboratorios disponibles</Text>
          ) : (
            laboratories.map((lab, index) => (
              <View
                key={lab.laboratorio_id?.toString() ?? `lab-${index}`}
                style={[styles.labItem, { width: cardWidth, marginHorizontal: 'auto' }]}
              >
                <Text style={styles.itemTitle}>{lab.nombre}</Text>
                <Text style={styles.itemText}>Ubicación: {lab.ubicacion}</Text>
                <Text style={styles.itemText}>Tipo: {lab.tipo_laboratorio}</Text>
                <Text style={styles.itemText}>Capacidad: {lab.capacidad}</Text>
                <Text style={styles.itemText}>Responsable: {getResponsibleName(lab.responsable_id)}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(lab)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(lab.laboratorio_id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal for Web */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar este laboratorio?</Text>
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
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  listScroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  labItem: {
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

export default LaboratoryScreen;