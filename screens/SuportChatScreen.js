import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../components/layout';

const { width } = Dimensions.get('window');

const SupportScreen = ({ route }) => {
  const user = route.params?.user || { nombre: null, apellido: null };

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
        url = `tel:${value}`;
        const canOpenCall = await Linking.canOpenURL(url);
        if (!canOpenCall) {
          Alert.alert('Error', 'No se puede realizar la llamada en este dispositivo');
          return;
        }
        Linking.openURL(url);
      } else if (type === 'whatsapp') {
        url = `whatsapp://send?phone=${value.replace('+', '')}&text=Hola, necesito soporte para la aplicación USB`;
        const canOpenWhatsApp = await Linking.canOpenURL(url);
        if (!canOpenWhatsApp) {
          Alert.alert('Error', 'WhatsApp no está instalado o no se puede abrir');
          return;
        }
        Linking.openURL(url);
      } else if (type === 'email') {
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

  // Responsive web container
  const isWeb = Platform.OS === 'web';
  const containerStyle = [
    styles.container,
    isWeb && {
      backgroundColor: '#fff',
      maxWidth: 600,
      margin: '40px auto',
      borderRadius: 18,
      boxShadow: '0 2px 16px 0 rgba(0, 0, 0, 0)',
      padding: 32,
      minHeight: 400,
    },
  ];
  const contactContainerStyle = [
    styles.contactContainer,
    isWeb && {
      backgroundColor: '#f7f7f7',
      borderRadius: 14,
      padding: 20,
      marginTop: 16,
    },
  ];

  return (
    <Layout>
      <ScrollView contentContainerStyle={isWeb ? { alignItems: 'center', paddingVertical: 32, backgroundColor: '#f4f6fa' } : styles.scrollContainer}>
        <View style={containerStyle}>
          <View style={styles.header}>
            <Text style={[styles.title, isWeb && { color: '#1e293b' }]}>Soporte</Text>
            <Text style={[styles.userName, isWeb && { color: '#475569' }]}>
              {user.nombre ? `${user.nombre}${user.apellido ? ` ${user.apellido}` : ''}` : 'Desconocido'}
            </Text>
          </View>
          <View style={contactContainerStyle}>
            <Text style={[styles.sectionTitle, isWeb && { color: '#1e293b' }]}>Contactos de Soporte</Text>
            {supportContacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={[styles.contactLabel, isWeb && { color: '#334155' }]}>{contact.label}</Text>
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
    flexGrow: 1,
    backgroundColor: '#0000',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    width: '100%',
    padding: width < 400 ? 10 : 20,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    color: '#ffff',
    fontSize: width < 400 ? 20 : 26,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  userName: {
    color: '#b8c1ec',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '500',
    marginTop: 4,
  },
  contactContainer: {
    backgroundColor: 'rgba(35, 41, 70, 0)',
    borderRadius: 14,
    padding: width < 400 ? 12 : 16,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#1e90ff',
    fontSize: width < 400 ? 16 : 20,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  contactItem: {
    marginBottom: 20,
    overflow: 'visible',
  },
  contactLabel: {
    color: '#334155',
    fontSize: width < 400 ? 14 : 16,
    marginBottom: 8,
    textAlign: 'center',
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
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  emailButton: {
    flex: 0,
    width: '100%',
    marginHorizontal: 0,
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