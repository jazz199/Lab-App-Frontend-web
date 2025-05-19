import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const UserLabReportItem = ({ reserva }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{reserva.laboratorio_nombre}</Text>
      <Text style={styles.itemText}>Ubicación: {reserva.ubicacion}</Text>
      <Text style={styles.itemText}>Fecha Inicio: {new Date(reserva.fecha_inicio).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Fecha Fin: {new Date(reserva.fecha_fin).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Propósito: {reserva.proposito}</Text>
      <Text style={styles.itemText}>Estado: {reserva.estado}</Text>
    </View>
  );
};

const UserLabReportItemPrestamo = ({ reserva }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{reserva.laboratorio_nombre}</Text>
      <Text style={styles.itemText}>Ubicación: {reserva.ubicacion}</Text>
      <Text style={styles.itemText}>Fecha Inicio: {new Date(reserva.fecha_inicio).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Fecha Fin: {new Date(reserva.fecha_fin).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Propósito: {reserva.proposito}</Text>
      <Text style={styles.itemText}>Estado: {reserva.estado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemTitle: {
    color: "#ffffff",
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemText: {
    color: "#e0e0e0",
    fontSize: 14,
  },
});

export default UserLabReportItem;