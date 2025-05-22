import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAdminDashboardData, getUsers, getLaboratories, getEquipment, getEquipmentCategories, getLoans, getLabReservations, getMaintenaint } from '../api';
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

const AdminDashboardScreen = ({ route }) => {
  const user = route.params?.user || { id: null, nombre: null, apellido: null, tipo_usuario: null };
  const isFocused = useIsFocused();
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    users_by_type: { estudiante: 0, profesor: 0, personal: 0, admin: 0 },
    total_labs: 0,
    labs_by_type: { electronica: 0, hardware: 0, telecomunicaciones: 0, redes: 0 },
    total_equipment: 0,
    equipment_by_category: {},
    total_loans: 0,
    loans_by_status: { activo: 0, devuelto: 0, atrasado: 0 },
    total_reservations: 0,
    reservations_by_status: { pendiente: 0, aprobada: 0, cancelada: 0 },
    total_maintenances: 0,
    most_requested_equipment: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const screenWidth = Dimensions.get('window').width - 32;

  // Check if user is admin
  if (user.tipo_usuario !== 'admin') {
    return (
      <Layout>
        <Text style={styles.title}>Acceso denegado. Solo para administradores.</Text>
      </Layout>
    );
  }

  // Chart data
  const overviewBarData = {
    labels: ['Usuarios', 'Labs', 'Equipos', 'Préstamos', 'Reservas', 'Mantenimientos'],
    datasets: [
      {
        data: [
          dashboardData.total_users,
          dashboardData.total_labs,
          dashboardData.total_equipment,
          dashboardData.total_loans,
          dashboardData.total_reservations,
          dashboardData.total_maintenances,
        ],
      },
    ],
  };

  const userPieData = Object.entries(dashboardData.users_by_type).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    color: ['#1e90ff', '#28a745', '#ff8c00', '#ff4444'][index % 4],
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  const labPieData = Object.entries(dashboardData.labs_by_type).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    color: ['#32cd32', '#FFD700', '#dc143c', '#87ceeb'][index % 4],
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  const loanPieData = Object.entries(dashboardData.loans_by_status).map(([status, count], index) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    color: ['#1e90ff', '#28a745', '#ff4444'][index % 3],
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  const reservationPieData = Object.entries(dashboardData.reservations_by_status).map(([status, count], index) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    color: ['#ff8c00', '#32cd32', '#dc143c'][index % 3],
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  const loadDashboardData = useCallback(async () => {
    try {
      // Fetch all data
      const [users, labs, equipment, categories, loans, reservations, maintenances] = await Promise.all([
        getUsers(),
        getLaboratories(),
        getEquipment(),
        getEquipmentCategories(),
        getLoans(),
        getLabReservations(),
        getMaintenaint(),
      ]);

      // Calculate metrics
      const usersByType = { estudiante: 0, profesor: 0, personal: 0, admin: 0 };
      users.forEach(user => usersByType[user.tipo_usuario]++);

      const labsByType = { electronica: 0, hardware: 0, telecomunicaciones: 0, redes: 0 };
      labs.forEach(lab => labsByType[lab.tipo_laboratorio]++);

      const equipmentByCategory = {};
      categories.forEach(cat => equipmentByCategory[cat.nombre] = 0);
      equipment.forEach(eq => {
        const cat = categories.find(c => c.categoria_id === eq.categoria_id);
        if (cat) equipmentByCategory[cat.nombre]++;
      });

      const loansByStatus = { activo: 0, devuelto: 0, atrasado: 0 };
      loans.forEach(loan => loansByStatus[loan.estado]++);

      const reservationsByStatus = { pendiente: 0, aprobada: 0, cancelada: 0 };
      reservations.forEach(res => reservationsByStatus[res.estado]++);

      // Most requested equipment
      const loanCounts = loans.reduce((acc, loan) => {
        acc[loan.equipo_id] = (acc[loan.equipo_id] || 0) + 1;
        return acc;
      }, {});
      const mostRequested = Object.entries(loanCounts)
        .map(([equipo_id, count]) => {
          const eq = equipment.find(e => e.equipo_id === parseInt(equipo_id));
          return { equipo_id, nombre: eq?.nombre || 'Desconocido', count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const newData = {
        total_users: users.length,
        users_by_type: usersByType,
        total_labs: labs.length,
        labs_by_type: labsByType,
        total_equipment: equipment.length,
        equipment_by_category: equipmentByCategory,
        total_loans: loans.length,
        loans_by_status: loansByStatus,
        total_reservations: reservations.length,
        reservations_by_status: reservationsByStatus,
        total_maintenances: maintenances.length,
        most_requested_equipment: mostRequested,
        users,
        labs,
        equipment,
        categories,
        loans,
        reservations,
        maintenances,
      };

      setDashboardData(newData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'No se pudo cargar el dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    if (isFocused) {
      const intervalId = setInterval(loadDashboardData, 30000);
      return () => clearInterval(intervalId);
    }
  }, [isFocused, loadDashboardData]);

  const generatePDF = async () => {
    try {
      const generateTable = (title, data, type) => {
        if (!data || data.length === 0) return '';
        let headers, rowDataFn;
        switch (type) {
          case 'users':
            headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Tipo', 'Identificación'];
            rowDataFn = item => ({
              ID: item.usuario_id,
              Nombre: item.nombre,
              Apellido: item.apellido,
              Email: item.email,
              Tipo: item.tipo_usuario,
              Identificación: item.numero_identificacion,
            });
            break;
          case 'labs':
            headers = ['ID', 'Nombre', 'Ubicación', 'Tipo', 'Capacidad'];
            rowDataFn = item => ({
              ID: item.laboratorio_id,
              Nombre: item.nombre,
              Ubicación: item.ubicacion,
              Tipo: item.tipo_laboratorio,
              Capacidad: item.capacidad,
            });
            break;
          case 'equipment':
            headers = ['ID', 'Nombre', 'Código', 'Categoría', 'Estado'];
            rowDataFn = item => ({
              ID: item.equipo_id,
              Nombre: item.nombre,
              Código: item.codigo_inventario,
              Categoría: dashboardData.categories.find(c => c.categoria_id === item.categoria_id)?.nombre || 'N/A',
              Estado: item.estado || 'N/A',
            });
            break;
          case 'categories':
            headers = ['ID', 'Nombre', 'Descripción'];
            rowDataFn = item => ({
              ID: item.categoria_id,
              Nombre: item.nombre,
              Descripción: item.descripcion || 'N/A',
            });
            break;
          case 'loans':
            headers = ['ID', 'Usuario', 'Equipo', 'Fecha Préstamo', 'Estado'];
            rowDataFn = item => ({
              ID: item.prestamo_id,
              Usuario: dashboardData.users.find(u => u.usuario_id === item.usuario_id)?.nombre || 'N/A',
              Equipo: dashboardData.equipment.find(e => e.equipo_id === item.equipo_id)?.nombre || 'N/A',
              Fecha_Préstamo: item.fecha_prestamo ? new Date(item.fecha_prestamo).toLocaleString('es-ES') : 'N/A',
              Estado: item.estado,
            });
            break;
          case 'reservations':
            headers = ['ID', 'Laboratorio', 'Usuario', 'Fecha Inicio', 'Estado'];
            rowDataFn = item => ({
              ID: item.reserva_id,
              Laboratorio: dashboardData.labs.find(l => l.laboratorio_id === item.laboratorio_id)?.nombre || 'N/A',
              Usuario: dashboardData.users.find(u => u.usuario_id === item.usuario_id)?.nombre || 'N/A',
              Fecha_Inicio: item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleString('es-ES') : 'N/A',
              Estado: item.estado,
            });
            break;
          case 'maintenances':
            headers = ['ID', 'Equipo', 'Fecha Inicio', 'Técnico', 'Costo'];
            rowDataFn = item => ({
              ID: item.mantenimiento_id,
              Equipo: dashboardData.equipment.find(e => e.equipo_id === item.equipo_id)?.nombre || 'N/A',
              Fecha_Inicio: item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleString('es-ES') : 'N/A',
              Técnico: item.tecnico || 'N/A',
              Costo: item.costo || 'N/A',
            });
            break;
          case 'most_requested':
            headers = ['Equipo', 'Préstamos'];
            rowDataFn = item => ({
              Equipo: item.nombre,
              Préstamos: item.count,
            });
            break;
          default:
            return '';
        }

        let tableRows = '';
        data.forEach(item => {
          const rowData = rowDataFn(item);
          tableRows += `
            <tr>
              ${Object.values(rowData).map(value => `<td style="border: 1px solid #000; padding: 5px;">${value}</td>`).join('')}
            </tr>
          `;
        });

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

      const generateSummaryTable = (title, data) => {
        if (!data || data.length === 0) return '';
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
              tr { page-break-inside  { page-break-inside: avoid; page-break-after: auto; }
            </style>
          </head>
          <body>
            <h1>Panel de Administración - Reporte General</h1>
            <p><strong>Generado por:</strong> ${user.nombre} ${user.apellido || ''}</p>
            ${generateTable('Usuarios', dashboardData.users, 'users')}
            ${generateTable('Laboratorios', dashboardData.labs, 'labs')}
            ${generateTable('Equipos', dashboardData.equipment, 'equipment')}
            ${generateTable('Categorías de Equipos', dashboardData.categories, 'categories')}
            ${generateTable('Préstamos', dashboardData.loans, 'loans')}
            ${generateTable('Reservas de Laboratorios', dashboardData.reservations, 'reservations')}
            ${generateTable('Mantenimientos', dashboardData.maintenances, 'maintenances')}
            ${generateTable('Equipos Más Solicitados', dashboardData.most_requested_equipment, 'most_requested')}
            ${generateSummaryTable('Distribución de Usuarios', userPieData)}
            ${generateSummaryTable('Distribución de Laboratorios', labPieData)}
            ${generateSummaryTable('Distribución de Préstamos', loanPieData)}
            ${generateSummaryTable('Distribución de Reservas', reservationPieData)}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const fileName = `Panel_Admin${new Date().toISOString().split('T')[0]}.pdf`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir o guardar el reporte PDF',
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
        <Text style={styles.title}>Cargando dashboard...</Text>
      </Layout>
    );
  }

  const getCardData = (item, type) => {
    switch (type) {
      case 'users':
        return {
          title: `${item.nombre} ${item.apellido}`,
          subtitle: `ID: ${item.usuario_id} | Tipo: ${item.tipo_usuario}`,
          date: item.fecha_registro ? new Date(item.fecha_registro).toLocaleDateString('es-ES') : 'Sin fecha',
        };
      case 'labs':
        return {
          title: item.nombre,
          subtitle: `ID: ${item.laboratorio_id} | Tipo: ${item.tipo_laboratorio}`,
          date: item.ubicacion || 'Sin ubicación',
        };
      case 'equipment':
        return {
          title: item.nombre,
          subtitle: `ID: ${item.equipo_id} | Código: ${item.codigo_inventario}`,
          date: item.fecha_adquisicion ? new Date(item.fecha_adquisicion).toLocaleDateString('es-ES') : 'Sin fecha',
        };
      case 'loans':
        return {
          title: dashboardData.equipment.find(e => e.equipo_id === item.equipo_id)?.nombre || 'Equipo desconocido',
          subtitle: `ID: ${item.prestamo_id} | Estado: ${item.estado}`,
          date: item.fecha_prestamo ? new Date(item.fecha_prestamo).toLocaleDateString('es-ES') : 'Sin fecha',
        };
      case 'reservations':
        return {
          title: dashboardData.labs.find(l => l.laboratorio_id === item.laboratorio_id)?.nombre || 'Laboratorio desconocido',
          subtitle: `ID: ${item.reserva_id} | Estado: ${item.estado}`,
          date: item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString('es-ES') : 'Sin fecha',
        };
      default:
        return { title: 'Desconocido', subtitle: '', date: '' };
    }
  };

  const handleItemPress = (item, type) => {
    setSelectedItem({ ...item, type });
    setModalVisible(true);
  };

  const renderSection = (title, data, color, type) => {
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
        {data.map((item, idx) => {
          const card = getCardData(item, type);
          return (
            <Card
              key={idx}
              title={card.title}
              subtitle={card.subtitle}
              date={card.date}
              color={color}
              onPress={() => handleItemPress(item, type)}
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
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <PieChart
          data={[
            { name: 'Usuarios', count: dashboardData.total_users, color: '#1e90ff', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Labs', count: dashboardData.total_labs, color: '#28a745', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Equipos', count: dashboardData.total_equipment, color: '#ff8c00', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Préstamos', count: dashboardData.total_loans, color: '#32cd32', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Reservas', count: dashboardData.total_reservations, color: '#dc143c', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Mantenimientos', count: dashboardData.total_maintenances, color: '#FFD700', legendFontColor: '#fff', legendFontSize: 14 },
          ]}
          width={screenWidth}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: () => '#fff',
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
          <Text style={styles.sectionTitle}>Distribución de Usuarios</Text>
          <PieChart
            data={userPieData}
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
          <Text style={styles.sectionTitle}>Distribución de Laboratorios</Text>
          <PieChart
            data={labPieData}
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
          <Text style={styles.sectionTitle}>Distribución de Préstamos</Text>
          <PieChart
            data={loanPieData}
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
          <Text style={styles.sectionTitle}>Distribución de Reservas</Text>
          <PieChart
            data={reservationPieData}
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
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Panel</Text>
        <Text style={styles.userName}>
          {user.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Administrador'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.newButton} onPress={() => setShowCharts(true)}>
          <LinearGradient colors={['#1e90ff', '#4682b4']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Gráficos</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newButton} onPress={generatePDF}>
          <LinearGradient colors={['#ff4444', '#ff6666']} style={styles.buttonGradient}>
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
            <Text style={styles.modalTitle}>
              {selectedItem?.type === 'users' ? 'Detalles del Usuario' :
               selectedItem?.type === 'labs' ? 'Detalles del Laboratorio' :
               selectedItem?.type === 'equipment' ? 'Detalles del Equipo' :
               selectedItem?.type === 'loans' ? 'Detalles del Préstamo' :
               selectedItem?.type === 'reservations' ? 'Detalles de la Reserva' : 'Detalles'}
            </Text>
            {selectedItem && (
              selectedItem.type === 'users' ? (
                Object.entries({
                  ID: selectedItem.usuario_id,
                  Nombre: selectedItem.nombre,
                  Apellido: selectedItem.apellido,
                  Email: selectedItem.email,
                  Tipo: selectedItem.tipo_usuario,
                  Identificación: selectedItem.numero_identificacion,
                  Fecha_Registro: selectedItem.fecha_registro ? new Date(selectedItem.fecha_registro).toLocaleString('es-ES') : 'N/A',
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : selectedItem.type === 'labs' ? (
                Object.entries({
                  ID: selectedItem.laboratorio_id,
                  Nombre: selectedItem.nombre,
                  Ubicación: selectedItem.ubicacion,
                  Tipo: selectedItem.tipo_laboratorio,
                  Capacidad: selectedItem.capacidad,
                  Responsable: dashboardData.users.find(u => u.usuario_id === selectedItem.responsable_id)?.nombre || 'N/A',
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : selectedItem.type === 'equipment' ? (
                Object.entries({
                  ID: selectedItem.equipo_id,
                  Nombre: selectedItem.nombre,
                  Código: selectedItem.codigo_inventario,
                  Categoría: dashboardData.categories.find(c => c.categoria_id === selectedItem.categoria_id)?.nombre || 'N/A',
                  Laboratorio: dashboardData.labs.find(l => l.laboratorio_id === selectedItem.laboratorio_id)?.nombre || 'N/A',
                  Estado: selectedItem.estado || 'N/A',
                  Fecha_Adquisición: selectedItem.fecha_adquisicion ? new Date(selectedItem.fecha_adquisicion).toLocaleString('es-ES') : 'N/A',
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : selectedItem.type === 'loans' ? (
                Object.entries({
                  ID: selectedItem.prestamo_id,
                  Equipo: dashboardData.equipment.find(e => e.equipo_id === selectedItem.equipo_id)?.nombre || 'N/A',
                  Usuario: dashboardData.users.find(u => u.usuario_id === selectedItem.usuario_id)?.nombre || 'N/A',
                  Fecha_Préstamo: selectedItem.fecha_prestamo ? new Date(selectedItem.fecha_prestamo).toLocaleString('es-ES') : 'N/A',
                  Devolución_Prevista: selectedItem.fecha_devolucion_prevista ? new Date(selectedItem.fecha_devolucion_prevista).toLocaleString('es-ES') : 'N/A',
                  Devolución_Real: selectedItem.fecha_devolucion_real ? new Date(selectedItem.fecha_devolucion_real).toLocaleString('es-ES') : 'N/A',
                  Estado: selectedItem.estado,
                  Notas: selectedItem.notas || 'N/A',
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : selectedItem.type === 'reservations' ? (
                Object.entries({
                  ID: selectedItem.reserva_id,
                  Laboratorio: dashboardData.labs.find(l => l.laboratorio_id === selectedItem.laboratorio_id)?.nombre || 'N/A',
                  Usuario: dashboardData.users.find(u => u.usuario_id === selectedItem.usuario_id)?.nombre || 'N/A',
                  Fecha_Inicio: selectedItem.fecha_inicio ? new Date(selectedItem.fecha_inicio).toLocaleString('es-ES') : 'N/A',
                  Fecha_Fin: selectedItem.fecha_fin ? new Date(selectedItem.fecha_fin).toLocaleString('es-ES') : 'N/A',
                  Propósito: selectedItem.proposito || 'N/A',
                  Estado: selectedItem.estado,
                }).map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Text style={styles.modalKey}>{key.replace('_', ' ')}:</Text>
                    <Text style={styles.modalValue}>{String(value)}</Text>
                  </View>
                ))
              ) : null
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
            {renderSection('Usuarios', dashboardData.users, '#1e90ff', 'users')}
            {renderSection('Laboratorios', dashboardData.labs, '#28a745', 'labs')}
            {renderSection('Equipos', dashboardData.equipment, '#ff8c00', 'equipment')}
            {renderSection('Préstamos', dashboardData.loans, '#32cd32', 'loans')}
            {renderSection('Reservas', dashboardData.reservations, '#dc143c', 'reservations')}
            {renderSection('Equipos Más Solicitados', dashboardData.most_requested_equipment, '#FFD700', 'most_requested')}
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
    flexDirection: 'column',
    alignItems: 'flex-end',
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
    marginVertical: 5,
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

export default AdminDashboardScreen;