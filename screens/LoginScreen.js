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
            onLogin(user);
        } catch (error) {
            Alert.alert("Error", "Credenciales incorrectas o error en el servidor", [
                { text: "OK", style: "cancel" }
            ]);
        }
    };

    return (
        <Layout>
            <View style={styles.container}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 4,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -200, // Ajuste para centrar "casi" en el medio verticalmente
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 15,
    },
    registerText: {
        color: '#1e90ff',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LoginScreen;