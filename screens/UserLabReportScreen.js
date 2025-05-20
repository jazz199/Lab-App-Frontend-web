import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getUserLabReservas } from '../api';
import Layout from '../components/layout';
import { BarChart, PieChart } from 'react-native-chart-kit';

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
  const user = route.params?.user || { id: null };
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
  const [lastUpdated, setLastUpdated] = useState(null);
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
      setLastUpdated(new Date());
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

  const renderSection = (title, data, emptyMessage, color, isReserva) => (
    <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data && data.length > 0 ? (
        data.map((item, idx) => {
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
        })
      ) : (
        <Text style={styles.noDataText}>{emptyMessage}</Text>
      )}
    </View>
  );

  const renderChartsModal = () => (
    <Modal
      visible={showCharts}
      animationType="slide"
      onRequestClose={() => setShowCharts(false)}
    >
      <View style={{ flex: 1, backgroundColor: '#232946' }}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
          <Text style={styles.title}>Gráficos Estadísticos</Text>
          <Text style={styles.sectionTitle}>Estadísticas de Reservas (Barras)</Text>
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
          <Text style={styles.sectionTitle}>Distribución de Reservas (Torta)</Text>
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
          <Text style={styles.sectionTitle}>Estadísticas de Préstamos (Barras)</Text>
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
          <Text style={styles.sectionTitle}>Distribución de Préstamos (Torta)</Text>
          <PieChart
            data={prestamoPieData}
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
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowCharts(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const RenderHeader = () => (
    <View style={{ alignItems: 'left', paddingVertical: 10 }}>
      <Text style={styles.title}>Reporte {user.id || 'Desconocido'}</Text>
      <Text style={styles.lastUpdated}>
        Última actualización: {lastUpdated ? lastUpdated.toLocaleTimeString('es-ES') : 'Cargando...'}
      </Text>
      <TouchableOpacity style={styles.showChartsButton} onPress={() => setShowCharts(true)}>
        <Text style={styles.showChartsButtonText}>Gráficos</Text>
      </TouchableOpacity>
      <View style={styles.statsRow}>
        <Text style={styles.subtitle}>Total: {report.total_reservas}</Text>
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
            {renderSection('Todas las Reservas', report.todas_reservas, 'No hay reservas registradas', '#1e90ff', true)}
            {renderSection('Reservas Aprobadas', report.reservas_aprobadas, 'No hay reservas aprobadas', '#28a745', true)}
            {renderSection('Reservas Pendientes', report.reservas_pendientes, 'No hay reservas pendientes', '#87ceeb', true)}
            {renderSection('Reservas Canceladas', report.reservas_canceladas, 'No hay reservas canceladas', '#ff4444', true)}
            {renderSection('Todos los Préstamos', report.todos_prestamos, 'No hay préstamos registrados', '#ff8c00', false)}
            {renderSection('Préstamos Pendientes', report.prestamos_pendientes, 'No hay préstamos pendientes', '#32cd32', false)}
            {renderSection('Préstamos Atrasados', report.prestamos_atrasados, 'No hay préstamos atrasados', '#dc143c', false)}
            {renderSection('Préstamos Devueltos', report.prestamos_devueltos, 'No hay préstamos devueltos', '#FFD700', false)}
          </View>
        )}
      />
      {renderItemModal()}
      {renderChartsModal()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 50, // Reducido para un header más compacto
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center', // Cambiado a center
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 14, // Reducido
    marginHorizontal: 10,
    textAlign: 'center', // Cambiado a center
  },
  lastUpdated: {
    color: '#b8c1ec',
    fontSize: 12, // Reducido
    marginBottom: 8,
    textAlign: 'center',
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
  showChartsButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 8, // Reducido
    paddingHorizontal: 24, // Reducido
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  showChartsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, // Reducido
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 47, 62, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(34, 47, 62, 0.74)',
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