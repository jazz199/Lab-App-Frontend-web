import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUsers, createUser, updateUser, deleteUser } from '../api.js';
import Layout from '../components/layout.js';

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
      console.log('Datos de usuarios:', data); // Depuración
      const validData = data.filter(user => user.usuario_id !== undefined && user.usuario_id !== null);
      setUsers(validData);
    } catch (error) {
      console.error('Error en loadUsers:', error);
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
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      numero_identificacion: user.numero_identificacion || '',
      tipo_usuario: user.tipo_usuario || 'estudiante',
    });
    setEditingUserId(user.usuario_id);
    setIsFormVisible(true);
  };

  const handleNew = () => {
    setForm({
      nombre: '',
      apellido: '',
      email: '',
      numero_identificacion: '',
      tipo_usuario: 'estudiante',
    });
    setEditingUserId(null);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const userData = { ...form };
      if (editingUserId) {
        const updatedUser = await updateUser(editingUserId, userData);
        console.log('Usuario actualizado:', updatedUser); // Depuración
        setUsers(users.map(user =>
          user.usuario_id === editingUserId ? { usuario_id: editingUserId, ...userData } : user
        ));
        Alert.alert("Éxito", "Usuario actualizado correctamente");
      } else {
        const newUser = await createUser(userData);
        console.log('Nuevo usuario creado:', newUser); // Depuración
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

  const isWeb = Platform.OS === 'web';
  const cardWidth = isWeb ? (width > 1200 ? 600 : width > 800 ? 500 : width > 600 ? 400 : '90%') : '90%';
  const containerWidth = isWeb ? (width > 1200 ? 1000 : width > 800 ? 800 : width > 600 ? 600 : '90%') : '100%';

  if (isFormVisible) {
    return (
      <Layout>
        
          <View style={[styles.formContainer, { width: cardWidth }]}>
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
              onChangeText={(text) => setForm({ ...form, apellido: text })}
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
        
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={[styles.header, isWeb && { maxWidth: containerWidth, marginHorizontal: 'auto' }]}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNew}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listScroll, isWeb && { alignItems: 'center', paddingHorizontal: 10 }]}
        style={[isWeb && { maxHeight: height * 0.8, width: '100%' }]}
      >
        <View style={[styles.listContainer, { width: cardWidth }]}>
          {users.length === 0 ? (
            <Text style={styles.noDataText}>No hay usuarios disponibles</Text>
          ) : (
            users.map((user, index) => (
              <View
                key={user.usuario_id?.toString() ?? `user-${index}`}
                style={[styles.userItem, isWeb && { width: cardWidth, marginHorizontal: 'auto' }]}
              >
                <Text style={styles.itemTitle}>{user.nombre}</Text>
                <Text style={styles.itemText}>Apellido: {user.apellido}</Text>
                <Text style={styles.itemText}>Email: {user.email}</Text>
                <Text style={styles.itemText}>Nº Identificación: {user.numero_identificacion}</Text>
                <Text style={styles.itemText}>Tipo: {user.tipo_usuario}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(user)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(user.usuario_id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  userItem: {
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
});

export default UserFormScreen;