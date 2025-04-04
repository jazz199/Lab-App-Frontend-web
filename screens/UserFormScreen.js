// FILE: screens/UserFormScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUsers, createUser, updateUser, deleteUser } from '../api.js';
import Layout from '../components/layout.js';
import UserList from '../components/UserList.js';

const UserFormScreen = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    numero_identificacion: '',
    tipo_usuario: 'estudiante', // Valor por defecto
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
        await updateUser(editingUserId, form);
        setUsers(users.map(user =>
          user.usuario_id === editingUserId ? { ...user, ...form } : user
        ));
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

  if (isFormVisible) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <UserList users={users} onDelete={handleDelete} onEdit={handleEdit} />
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

export default UserFormScreen;