import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Layout from '../components/layout';
import { getLoanReports, getEquipmentUsageByFaculty, getTopRequestedEquipment, createLoan, checkEquipmentAvailability } from '../api';
import emailjs from 'emailjs-com';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = ({ route }) => {
  const user = route.params?.user || { usuario_id: null, email: '' };
  const [loanData, setLoanData] = useState(null);
  const [facultyData, setFacultyData] = useState(null);
  const [topEquipment, setTopEquipment] = useState(null);

  const loadReports = async () => {
    try {
      const loans = await getLoanReports();
      const faculty = await getEquipmentUsageByFaculty();
      const topEquip = await getTopRequestedEquipment();
      setLoanData(loans);
      setFacultyData(faculty);
      setTopEquipment(topEquip);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    }
  };

  // Enviar notificación por correo
  const sendEmailNotification = (templateParams, type) => {
    emailjs.send(
      'YOUR_SERVICE_ID', // Reemplaza con tu EmailJS Service ID
      type === 'confirmation' ? 'YOUR_CONFIRMATION_TEMPLATE_ID' : 'YOUR_REMINDER_TEMPLATE_ID', // Reemplaza con tus Template IDs
      templateParams,
      'YOUR_USER_ID' // Reemplaza con tu EmailJS User ID
    ).then(
      () => console.log('Correo enviado exitosamente'),
      (error) => console.error('Error al enviar correo:', error)
    );
  };

  // Validar disponibilidad y crear préstamo
  const handleLoanRequest = async (equipo_id, fecha) => {
    try {
      const availability = await checkEquipmentAvailability(equipo_id, fecha);
      if (!availability.disponible) {
        Alert.alert('No disponible', `El equipo no está disponible el ${fecha}`);
        return;
      }

      const loanData = {
        usuario_id: user.usuario_id,
        equipo_id,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_devolucion_prevista: fecha,
        estado: 'activo',
      };
      const newLoan = await createLoan(loanData);

      // Enviar correo de confirmación
      sendEmailNotification({
        to_email: user.email,
        equipo_nombre: availability.equipo_nombre,
        fecha_prestamo: loanData.fecha_prestamo,
        fecha_devolucion: loanData.fecha_devolucion_prevista,
      }, 'confirmation');

      Alert.alert('Éxito', 'Préstamo solicitado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la solicitud de préstamo');
    }
  };

  // Enviar recordatorio de devolución (ejemplo: al acercarse la fecha)
  const sendReminder = (loan) => {
    const today = new Date();
    const devolutionDate = new Date(loan.fecha_devolucion_prevista);
    if (devolutionDate.toDateString() === today.toDateString()) {
      sendEmailNotification({
        to_email: user.email,
        equipo_nombre: loan.equipo_nombre,
        fecha_devolucion: loan.fecha_devolucion_prevista,
      }, 'reminder');
    }
  };

  useEffect(() => {
    loadReports();
    emailjs.init('YOUR_USER_ID'); // Inicializar EmailJS con tu User ID
  }, []);

  if (!loanData || !facultyData || !topEquipment) {
    return (
      <Layout>
        <Text style={styles.title}>Cargando reportes...</Text>
      </Layout>
    );
  }

  // Datos para gráficos (ejemplo basado en respuesta del backend)
  const loanChartData = {
    labels: loanData.dates || ['2025-05-01', '2025-05-02', '2025-05-03'],
    datasets: [
      {
        label: 'Préstamos',
        data: loanData.prestamos || [10, 15, 8],
        backgroundColor: '#1e90ff',
      },
      {
        label: 'Devoluciones',
        data: loanData.devoluciones || [5, 10, 6],
        backgroundColor: '#28a745',
      },
    ],
  };

  const facultyChartData = {
    labels: facultyData.facultades || ['Ingeniería', 'Ciencias', 'Humanidades'],
    datasets: [
      {
        data: facultyData.usos || [30, 20, 10],
        backgroundColor: '#1e90ff',
      },
    ],
  };

  const topEquipmentChartData = [
    {
      name: topEquipment[0]?.nombre || 'PC Core i5',
      population: topEquipment[0]?.count || 25,
      color: '#1e90ff',
      legendFontColor: '#fff',
      legendFontSize: 12,
    },
    {
      name: topEquipment[1]?.nombre || 'Osciloscopio',
      population: topEquipment[1]?.count || 15,
      color: '#ff4444',
      legendFontColor: '#fff',
      legendFontSize: 12,
    },
    {
      name: topEquipment[2]?.nombre || 'Multímetro',
      population: topEquipment[2]?.count || 10,
      color: '#28a745',
      legendFontColor: '#fff',
      legendFontSize: 12,
    },
  ];

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reportes de Laboratorios</Text>

        {/* Gráfico de barras: Préstamos y devoluciones por fecha */}
        <Text style={styles.chartTitle}>Préstamos y Devoluciones por Fecha</Text>
        <BarChart
          data={loanChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#222f3e',
            backgroundGradientTo: '#222f3e',
            decimalPlaces: 0,
            color: () => '#fff',
            labelColor: () => '#fff',
            barPercentage: 0.4,
          }}
          style={styles.chart}
        />

        {/* Gráfico de barras: Uso de equipos por facultad */}
        <Text style={styles.chartTitle}>Uso de Equipos por Facultad</Text>
        <BarChart
          data={facultyChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#222f3e',
            backgroundGradientTo: '#222f3e',
            decimalPlaces: 0,
            color: () => '#fff',
            labelColor: () => '#fff',
            barPercentage: 0.4,
          }}
          style={styles.chart}
        />

        {/* Gráfico de torta: Equipos más solicitados */}
        <Text style={styles.chartTitle}>Equipos Más Solicitados</Text>
        <PieChart
          data={topEquipmentChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#222f3e',
            backgroundGradientTo: '#222f3e',
            color: () => '#fff',
            labelColor: () => '#fff',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />

        {/* Ejemplo de solicitud de préstamo con validación */}
        <Text style={styles.chartTitle}>Solicitar Préstamo</Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleLoanRequest(1, '2025-05-20')} // Ejemplo: equipo_id=1, fecha=2025-05-20
        >
          <Text style={styles.buttonText}>Solicitar PC Core i5</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportsScreen;