import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUsers, createUser, updateUser, deleteUser } from '../api.js';
import Layout from '../components/layout.js';
import UserList from '../components/UserList.js';

const { width, height } = Dimensions.get('window');

const UserFormScreen = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    numero_identificacion: '',
    tipo_usuario: 'estudiante',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error en load Users:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres eliminar este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteUser(id);
              setUsers(users.filter(user => user.usuario_id !== id));
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (user) => {
    setForm({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      numero_identificacion: user.numero_identificacion,
      tipo_usuario: user.tipo_usuario || 'estudiante',
    });
    setEditingUserId(user.usuario_id);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingUserId) {
        const updatedUser = await updateUser(editingUserId, form);
        setUsers(users.map(user => (user.usuario_id === editingUserId ? updatedUser : user)));
        Alert.alert("Éxito", "Usuario actualizado correctamente");
      } else {
        const newUser = await createUser(form);
        setUsers([...users, newUser]);
        Alert.alert("Éxito", "Usuario creado correctamente");
      }
      setForm({ nombre: '', apellido: '', email: '', numero_identificacion: '', tipo_usuario: 'estudiante' });
      setIsFormVisible(false);
      setEditingUserId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el usuario");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Responsive styles for web
  const isWeb = Platform.OS === 'web';
  const formWidth = isWeb ? (width > 1200 ? 600 : width > 800 ? 500 : width > 600 ? 400 : '90%') : '90%';
  const listWidth = isWeb ? (width > 1200 ? 1000 : width > 800 ? 800 : width > 600 ? 600 : '90%') : '100%';

  if (isFormVisible) {
    return (
      <Layout>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={[styles.formScroll, isWeb && { alignItems: 'center' }]}
          >
            <View style={[styles.formContainer, { width: formWidth }]}>
              <Text style={styles.title}>{editingUserId ? "Editar Usuario" : "Nuevo Usuario"}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#aaa"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#aaa"
                value={form.apellido}
                onCh
                angeText={(text) => setForm({ ...form, apellido: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Número de Identificación"
                placeholderTextColor="#aaa"
                value={form.numero_identificacion}
                onChangeText={(text) => setForm({ ...form, numero_identificacion: text })}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.tipo_usuario}
                  style={styles.picker}
                  onValueChange={(itemValue) => setForm({ ...form, tipo_usuario: itemValue })}
                >
                  <Picker.Item label="Estudiante" value="estudiante" />
                  <Picker.Item label="Profesor" value="profesor" />
                  <Picker.Item label="Personal" value="personal" />
                </Picker>
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsFormVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={[styles.header, isWeb && { maxWidth: listWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.listContainer, isWeb && { alignItems: 'center' }]}>
        <ScrollView
          contentContainerStyle={[styles.listScroll, isWeb && { alignItems: 'center', paddingHorizontal: 10 }]}
          style={[isWeb && { maxHeight: height * 0.8, width: '100%' }]}
        >
          <View style={{ width: listWidth, maxWidth: '100%' }}>
            <UserList users={users} onDelete={handleDelete} onEdit={handleEdit} />
          </View>
        </ScrollView>
      </View>
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
    marginTop: 2,
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
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
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
});

export default UserFormScreen;