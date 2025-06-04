import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions } from 'react-native';
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

    // Responsive centering for web
    const { width } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const containerStyle = [
        styles.container,
        isWeb && {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            minHeight: 380,
            maxWidth: 400,
            width: '100%',
            height: 'fit-content',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(30,30,60,0.85)',
            borderRadius: 18,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
            padding: 32,
        }
    ];

    return (
        <Layout>
            <View style={containerStyle}>
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
        flex: 1,
        width: '90%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 12, 0)',
        borderRadius: 18,
        padding: 32,
        marginTop: 60,
        marginBottom: 60,
    },
    title: {
        color: '#ffffff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#222',
        boxSizing: 'border-box',
    },
    submitButton: {
        backgroundColor: '#1e90ff',
        padding: 12,
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
        marginTop: 18,
        width: '100%',
    },
    registerText: {
        color: '#1e90ff',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default LoginScreen;