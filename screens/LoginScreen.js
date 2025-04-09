import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Layout from '../components/layout';
import { loginUser } from '../api';

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await loginUser({ email, password });
            onLogin(user); // Pasamos el usuario logueado al componente padre
        } catch (error) {
            Alert.alert("Error", "Credenciales incorrectas o error en el servidor");
        }
    };

    return (
        <Layout>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => onLogin(null, true)}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: { color: '#ffffff', fontSize: 24, marginBottom: 20 },
    input: { backgroundColor: '#333', color: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, width: '80%' },
    submitButton: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
    registerButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginTop: 10, width: '80%', alignItems: 'center' },
    buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;