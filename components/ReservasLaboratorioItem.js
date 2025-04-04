import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const ReservasLaboratorioItem = ({ reserva }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Reserva ID: {reserva.reserva_id}</Text>
      <Text style={styles.itemText}>Laboratorio ID: {reserva.laboratorio_id}</Text>
      <Text style={styles.itemText}>Usuario ID: {reserva.usuario_id}</Text>
      <Text style={styles.itemText}>Fecha Inicio: {reserva.fecha_inicio}</Text>
      <Text style={styles.itemText}>Estado: {reserva.estado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#333333',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemTitle: {
    color: "#ffffff",
    fontWeight: 'bold',
  },
  itemText: {
    color: "#ffffff",
  },
});

export default ReservasLaboratorioItem;