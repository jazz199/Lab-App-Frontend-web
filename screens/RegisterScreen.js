import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Layout from '../components/layout';
import { registerUser } from '../api';

const RegisterScreen = ({ onRegister }) => {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        numero_identificacion: '',
        tipo_usuario: 'estudiante',
    });

    const handleSubmit = async () => {
        try {
            const newUser = await registerUser(form);
            Alert.alert("Éxito", "Usuario registrado correctamente");
            onRegister(); // Volver al login
        } catch (error) {
            Alert.alert("Error", "No se pudo registrar el usuario");
        }
    };

    return (
        <Layout>
            <Text style={styles.title}>Registro de Usuario</Text>
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#aaa" value={form.nombre} onChangeText={(text) => setForm({ ...form, nombre: text })} />
            <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#aaa" value={form.apellido} onChangeText={(text) => setForm({ ...form, apellido: text })} />
            <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#aaa" value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#aaa" value={form.password} onChangeText={(text) => setForm({ ...form, password: text })} secureTextEntry />
            <TextInput style={styles.input} placeholder="Número de Identificación" placeholderTextColor="#aaa" value={form.numero_identificacion} onChangeText={(text) => setForm({ ...form, numero_identificacion: text })} />
            <View style={styles.pickerContainer}>
                <Picker selectedValue={form.tipo_usuario} style={styles.picker} onValueChange={(itemValue) => setForm({ ...form, tipo_usuario: itemValue })}>
                    <Picker.Item label="Estudiante" value="estudiante" />
                    <Picker.Item label="Profesor" value="profesor" />
                    <Picker.Item label="Personal" value="personal" />
                    <Picker.Item label="Admin" value="admin" />
                </Picker>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onRegister}>
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: { color: '#ffffff', fontSize: 24, marginBottom: 20 },
    input: { backgroundColor: '#333', color: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, width: '80%' },
    pickerContainer: { backgroundColor: '#333', borderRadius: 5, marginVertical: 5, width: '80%' },
    picker: { color: '#fff' },
    submitButton: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
    cancelButton: { backgroundColor: '#ff4444', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
    buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default RegisterScreen;