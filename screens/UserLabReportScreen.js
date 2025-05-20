import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, FlatList, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getUserLabReservas } from '../api';
import Layout from '../components/layout';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const Card = ({ title, subtitle, date, color, onPress }) => (
  <View style={[styles.card, { borderLeftColor: color || '#1e90ff' }]}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
    <Text style={styles.cardDate}>{date}</Text>
  </View>
);

const UserLabReservasScreen = ({ route }) => {
  const user = route.params?.user || { id: null, nombre: null, apellido: null };
  const isFocused = useIsFocused();
  const [report, setReport] = useState({
    reservas_aprobadas: [],
    reservas_pendientes: [],
    reservas_canceladas: [],
    todas_reservas: [],
    total_reservas: 0,
    total_aprobadas: 0,
    total_pendientes_reservas: 0,
    total_canceladas: 0,
    prestamos_pendientes: [],
    prestamos_atrasados: [],
    prestamos_devueltos: [],
    todos_prestamos: [],
    total_prestamos: 0,
    total_pendientes_prestamos: 0,
    total_atrasados: 0,
    total_devueltos: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const screenWidth = Dimensions.get('window').width - 32;

  const reservaBarData = {
    labels: ['Total', 'Aprobadas', 'Pendientes', 'Canceladas'],
    datasets: [
      {
        data: [
          report.total_reservas,
          report.total_aprobadas,
          report.total_pendientes_reservas,
          report.total_canceladas
        ]
      }
    ]
  };

  const reservaPieData = [
    { name: 'Total', count: report.total_reservas, color: '#1e90ff', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Aprobadas', count: report.total_aprobadas, color: '#28a745', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Pendientes', count: report.total_pendientes_reservas, color: '#87ceeb', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Canceladas', count: report.total_canceladas, color: '#ff4444', legendFontColor: '#fff', legendFontSize: 14 }
  ];

  const prestamoBarData = {
    labels: ['Total', 'Pendientes', 'Atrasados', 'Devueltos'],
    datasets: [
      {
        data: [
          report.total_prestamos,
          report.total_pendientes_prestamos,
          report.total_atrasados,
          report.total_devueltos
        ]
      }
    ]
  };

  const prestamoPieData = [
    { name: 'Total', count: report.total_prestamos, color: '#ff8c00', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Pendientes', count: report.total_pendientes_prestamos, color: '#32cd32', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Atrasados', count: report.total_atrasados, color: '#dc143c', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Devueltos', count: report.total_devueltos, color: '#FFD700', legendFontColor: '#fff', legendFontSize: 14 }
  ];

  const loadReport = useCallback(async () => {
    if (!user.id) {
      Alert.alert('Error', 'ID de usuario no disponible');
      setLoading(false);
      return;
    }
    try {
      const data = await getUserLabReservas(user.id);
      const newReport = {
        reservas_aprobadas: data?.reservas_aprobadas || [],
        reservas_pendientes: data?.reservas_pendientes || [],
        reservas_canceladas: data?.reservas_canceladas || [],
        todas_reservas: data?.todas_reservas || [],
        total_reservas: data?.total_reservas || 0,
        total_aprobadas: data?.total_aprobadas || 0,
        total_pendientes_reservas: data?.total_pendientes_reservas || 0,
        total_canceladas: data?.total_canceladas || 0,
        prestamos_pendientes: data?.prestamos_pendientes || [],
        prestamos_atrasados: data?.prestamos_atrasados || [],
        prestamos_devueltos: data?.prestamos_devueltos || [],
        todos_prestamos: data?.todos_prestamos || [],
        total_prestamos: data?.total_prestamos || 0,
        total_pendientes_prestamos: data?.total_pendientes_prestamos || 0,
        total_atrasados: data?.total_atrasados || 0,
        total_devueltos: data?.total_devueltos || 0
      };

      if (JSON.stringify(newReport) !== JSON.stringify(report)) {
        setReport(newReport);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      Alert.alert('Error', 'No se pudo cargar el reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.id, report]);

  useEffect(() => {
    loadReport();
    if (isFocused) {
      const intervalId = setInterval(loadReport, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isFocused, loadReport]);

  const generatePDF = async () => {
    try {
      const generateTable = (title, data, isReserva) => {
        if (!data || data.length === 0) return '';
        let tableRows = '';
        data.forEach(item => {
          const rowData = isReserva ? {
            ID: item.reserva_id || 'N/A',
            Laboratorio: item.laboratorio_nombre || 'N/A',
            Ubicación: item.ubicacion || 'N/A',
            Fecha_Inicio: item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleString('es-ES') : 'N/A',
            Fecha_Fin: item.fecha_fin ? new Date(item.fecha_fin).toLocaleString('es-ES') : 'N/A',
            Propósito: item.proposito || 'N/A',
            Estado: item.estado || 'N/A'
          } : {
            ID: item.prestamo_id || 'N/A',
            Equipo: item.equipo_nombre || 'N/A',
            Fecha_Préstamo: item.fecha_prestamo ? new Date(item.fecha_prestamo).toLocaleString('es-ES') : 'N/A',
            Devolución_Prevista: item.fecha_devolucion_prevista ? new Date(item.fecha_devolucion_prevista).toLocaleString('es-ES') : 'N/A',
            Devolución_Real: item.fecha_devolucion_real ? new Date(item.fecha_devolucion_real).toLocaleString('es-ES') : 'N/A',
            Estado: item.estado || 'N/A',
            Notas: item.notas || 'N/A'
          };
          tableRows += `
            <tr>
              ${Object.values(rowData).map(value => `<td style="border: 1px solid #000; padding: 5px;">${value}</td>`).join('')}
            </tr>
          `;
        });

        const headers = isReserva
          ? ['ID', 'Laboratorio', 'Ubicación', 'Fecha Inicio', 'Fecha Fin', 'Propósito', 'Estado']
          : ['ID', 'Equipo', 'Fecha Préstamo', 'Devolución Prevista', 'Devolución Real', 'Estado', 'Notas'];

        return `
          <h2>${title}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                ${headers.map(header => `<th style="border: 1px solid #000; padding: 5px; background-color: #f0f0f0;">${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;
      };

      const generateSummaryTable = (title, data, colors) => {
        return `
          <h2>${title}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 5px; background-color: #f0f0f0;">Categoría</th>
                <th style="border: 1px solid #000; padding: 5px; background-color: #f0f0f0;">Cantidad</th>
                <th style="border: 1px solid #000; padding: 5px; background-color: #f0f0f0;">Color</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 5px;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 5px;">${item.count}</td>
                  <td style="border: 1px solid #000; padding: 5px; background-color: ${item.color};">${item.color}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      };

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              h2 { margin-top: 20px; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            </style>
          </head>
          <body>
            <h1>Reporte de Reservas y Préstamos</h1>
            <p><strong>Usuario:</strong> ${user.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Desconocido'}</p>
            ${generateTable('Todas las Reservas', report.todas_reservas, true)}
            ${generateTable('Reservas Aprobadas', report.reservas_aprobadas, true)}
            ${generateTable('Reservas Pendientes', report.reservas_pendientes, true)}
            ${generateTable('Reservas Canceladas', report.reservas_canceladas, true)}
            ${generateTable('Todos los Préstamos', report.todos_prestamos, false)}
            ${generateTable('Préstamos Pendientes', report.prestamos_pendientes, false)}
            ${generateTable('Préstamos Atrasados', report.prestamos_atrasados, false)}
            ${generateTable('Préstamos Devueltos', report.prestamos_devueltos, false)}
            ${generateSummaryTable('Resumen de Reservas', reservaPieData, ['#1e90ff', '#28a745', '#87ceeb', '#ff4444'])}
            ${generateSummaryTable('Resumen de Préstamos', prestamoPieData, ['#ff8c00', '#32cd32', '#dc143c', '#FFD700'])}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      const fileName = `Reporte_Usuario_${user.id || 'Desconocido'}_${new Date().toISOString().split('T')[0]}.pdf`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir o guardar el reporte PDF'
        });
      } else {
        Alert.alert('Éxito', `PDF generado en: ${newPath}`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Text style={styles.title}>Cargando reporte...</Text>
      </Layout>
    );
  }

  const getCardData = (item, isReserva) => ({
    title: isReserva ? (item.laboratorio_nombre || 'Laboratorio desconocido') : (item.equipo_nombre || 'Equipo desconocido'),
    subtitle: `ID: ${isReserva ? item.reserva_id : item.prestamo_id || '-'}`,
    date: (isReserva ? item.fecha_inicio : item.fecha_prestamo) ? new Date(isReserva ? item.fecha_inicio : item.fecha_prestamo).toLocaleDateString('es-ES') : 'Sin fecha'
  });

  const handleItemPress = (item, isReserva) => {
    setSelectedItem({ ...item, isReserva });
    setModalVisible(true);
  };

  const renderSection = (title, data, color, isReserva) => {
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
        {data.map((item, idx) => {
          const card = getCardData(item, isReserva);
          return (
            <Card
              key={idx}
              title={card.title}
              subtitle={card.subtitle}
              date={card.date}
              color={color}
              onPress={() => handleItemPress(item, isReserva)}
            />
          );
        })}
      </View>
    );
  };

  const renderChartsModal = () => (
    <Modal
      visible={showCharts}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCharts(false)}
    >
      <View style={{ flex: 1, borderRadius: 14, backgroundColor: 'rgba(35, 41, 70, 0.94)' }}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
          <Text style={styles.title}>Gráficos Estadísticos</Text>
          <Text style={styles.sectionTitle}>Estadísticas de Reservas</Text>
          <BarChart
            data={reservaBarData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#222f3e',
              backgroundGradientFrom: '#222f3e',
              backgroundGradientTo: '#1e90ff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              labelColor: () => '#fff',
              style: { borderRadius: 16 },
              propsForBackgroundLines: { stroke: '#444' }
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
          <Text style={styles.sectionTitle}>Distribución de Reservas</Text>
          <PieChart
            data={reservaPieData}
            width={screenWidth}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              labelColor: () => '#fff',
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={styles.sectionTitle}>Estadísticas de Préstamos</Text>
          <BarChart
            data={prestamoBarData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#222f3e',
              backgroundGradientFrom: '#222f3e',
              backgroundGradientTo: '#ff8c00',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              labelColor: () => '#fff',
              style: { borderRadius: 16 },
              propsForBackgroundLines: { stroke: '#444' }
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
          <Text style={styles.sectionTitle}>Distribución de Préstamos</Text>
          <PieChart
            data={prestamoPieData}
            width={screenWidth}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              Malibu: () => '#fff',
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowCharts(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const RenderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Reporte</Text>
        <Text style={styles.userName}>
          {user.nombre ? `${user.nombre}${user.apellido ? ` ${user.apellido}` : ''}` : 'Desconocido'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.newButton} onPress={() => setShowCharts(true)}>
          <LinearGradient
            colors={['#1e90ff', '#4682b4']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Gráficos</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newButton} onPress={generatePDF}>
          <LinearGradient
            colors={['#ff4444', '#ff6666']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Descargar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItemModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{selectedItem?.isReserva ? 'Detalles de la Reserva' : 'Detalles del Préstamo'}</Text>
            {selectedItem && (
              selectedItem.isReserva ? (
                Object.entries({
                  ID: selectedItem.reserva_id,
                  Laboratorio: selectedItem.laboratorio_nombre,
                  Ubicación: selectedItem.ubicacion,
                  Fecha_Inicio: selectedItem.fecha_inicio ? new Date(selectedItem.fecha_inicio).toLocaleString('es-ES') : 'N/A',
                  Fecha_Fin: selectedItem.fecha_fin ? new Date(selectedItem.fecha_fin).toLocaleString('es-ES') : 'N/A',
                  Propósito: selectedItem.proposito,
                  Estado: selectedItem.estado
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : (
                Object.entries({
                  ID: selectedItem.prestamo_id,
                  Equipo: selectedItem.equipo_nombre,
                  Fecha_Préstamo: selectedItem.fecha_prestamo ? new Date(selectedItem.fecha_prestamo).toLocaleString('es-ES') : 'N/A',
                  Devolución_Prevista: selectedItem.fecha_devolucion_prevista ? new Date(selectedItem.fecha_devolucion_prevista).toLocaleString('es-ES') : 'N/A',
                  Devolución_Real: selectedItem.fecha_devolucion_real ? new Date(selectedItem.fecha_devolucion_real).toLocaleString('es-ES') : 'N/A',
                  Estado: selectedItem.estado,
                  Notas: selectedItem.notas
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              )
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Layout>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={RenderHeader}
        ListFooterComponent={() => (
          <View style={{ alignItems: 'center', paddingBottom: 40, width: '100%' }}>
            {renderSection('Todas las Reservas', report.todas_reservas, '#1e90ff', true)}
            {renderSection('Reservas Aprobadas', report.reservas_aprobadas, '#28a745', true)}
            {renderSection('Reservas Pendientes', report.reservas_pendientes, '#87ceeb', true)}
            {renderSection('Reservas Canceladas', report.reservas_canceladas, '#ff4444', true)}
            {renderSection('Todos los Préstamos', report.todos_prestamos, '#ff8c00', false)}
            {renderSection('Préstamos Pendientes', report.prestamos_pendientes, '#32cd32', false)}
            {renderSection('Préstamos Atrasados', report.prestamos_atrasados, '#dc143c', false)}
            {renderSection('Préstamos Devueltos', report.prestamos_devueltos, '#FFD700', false)}
          </View>
        )}
      />
      {renderItemModal()}
      {renderChartsModal()}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(35, 41, 70, 0)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 0,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'column', // Cambiado de 'row' a 'column' para apilar botones
    alignItems: 'flex-end', // Alinear botones a la derecha
    justifyContent: 'center',
  },
  title: { 
    color: '#ffffff', 
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userName: {
    color: '#b8c1ec',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  newButton: { 
    borderRadius: 8, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 5, // Espaciado vertical entre botones
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataText: {
    color: '#e0e0e0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    width: '98%',
    backgroundColor: 'rgba(35, 41, 70, 0.92)',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textDecorationLine: 'underline',
  },
  cardSubtitle: {
    color: '#b8c1ec',
    fontSize: 16,
    marginBottom: 2,
  },
  cardDate: {
    color: '#eebbc3',
    fontSize: 15,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 47, 62, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(34, 47, 62, 0.93)',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffff',
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  modalKey: {
    fontWeight: 'bold',
    color: '#ffff',
    flex: 1,
  },
  modalValue: {
    color: '#ffff',
    flex: 2,
    textAlign: 'right',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserLabReservasScreen;