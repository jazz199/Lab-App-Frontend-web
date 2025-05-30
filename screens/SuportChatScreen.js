import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../components/layout';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const SupportScreen = ({ route }) => {
  const user = route.params?.user || { nombre: null, apellido: null };

  // Lista de contactos de soporte (puedes modificar estos valores)
  const supportContacts = [
    { type: 'phone', value: '+591 79532646', label: 'Soporte Técnico (591 79532646)' },
    { type: 'phone', value: '+591 71264106', label: 'Soporte Administrativo (+591 71264106)' },
    { type: 'email', value: 'jazielarmandovargaschoque@gmail.com', label: 'Soporte Técnico (jazielarmandovargaschoque@gmail.com)' },
    { type: 'email', value: 'admin@usb.com', label: 'Administración (admin@usb.com)' },
  ];

  const handleContact = async (type, value) => {
    let url;
    try {
      if (type === 'phone') {
        // Opción para llamada
        url = `tel:${value}`;
        const canOpenCall = await Linking.canOpenURL(url);
        if (!canOpenCall) {
          Alert.alert('Error', 'No se puede realizar la llamada en este dispositivo');
          return;
        }
        Linking.openURL(url);
      } else if (type === 'whatsapp') {
        // Opción para WhatsApp
        url = `whatsapp://send?phone=${value.replace('+', '')}&text=Hola, necesito soporte para la aplicación USB`;
        const canOpenWhatsApp = await Linking.canOpenURL(url);
        if (!canOpenWhatsApp) {
          Alert.alert('Error', 'WhatsApp no está instalado o no se puede abrir');
          return;
        }
        Linking.openURL(url);
      } else if (type === 'email') {
        // Opción para correo
        url = `mailto:${value}?subject=Soporte App USB&body=Hola, necesito ayuda con...`;
        const canOpenEmail = await Linking.canOpenURL(url);
        if (!canOpenEmail) {
          Alert.alert('Error', 'No se puede abrir el cliente de correo');
          return;
        }
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'No se pudo abrir el enlace de contacto');
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Soporte</Text>
            <Text style={styles.userName}>
              {user.nombre ? `${user.nombre}${user.apellido ? ` ${user.apellido}` : ''}` : 'Desconocido'}
            </Text>
          </View>
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Contactos de Soporte</Text>
            {supportContacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                {contact.type === 'phone' && (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleContact('phone', contact.value)}
                    >
                      <LinearGradient colors={['#1e90ff', '#4682b4']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>Llamar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleContact('whatsapp', contact.value)}
                    >
                      <LinearGradient colors={['#25D366', '#128C7E']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>WhatsApp</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
                {contact.type === 'email' && (
                  <TouchableOpacity
                    style={[styles.contactButton, styles.emailButton]}
                    onPress={() => handleContact('email', contact.value)}
                  >
                    <LinearGradient colors={['#ff4444', '#cc0000']} style={styles.buttonGradient}>
                      <Text style={styles.buttonText}>Enviar Correo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensure ScrollView takes full height
  },
  container: {
    flex: 1,
    width: '100%',
    padding: width < 400 ? 10 : 20,
    overflow: 'visible', // Prevent content clipping
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: '#ffffff',
    fontSize: width < 400 ? 20 : 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userName: {
    color: '#b8c1ec',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '500',
    marginTop: 4,
  },
  contactContainer: {
    backgroundColor: 'rgba(35, 41, 70, 0.92)',
    borderRadius: 14,
    padding: width < 400 ? 12 : 16,
    overflow: 'visible', // Ensure content is not clipped
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: width < 400 ? 16 : 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  contactItem: {
    marginBottom: 20, // Increased margin for better spacing
    overflow: 'visible', // Prevent clipping of buttons
  },
  contactLabel: {
    color: '#b8c1ec',
    fontSize: width < 400 ? 14 : 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  contactButton: {
    flex: 1,
    minWidth: width < 400 ? 120 : 140,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  emailButton: {
    flex: 0, // Override flex to allow full width
    width: '100%', // Ensure email button takes full width
    marginHorizontal: 0,
     // Remove horizontal margin for full width
  },
  buttonGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default SupportScreen;