// FILE: components/ReservasLaboratorioItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ReservasLaboratorioItem = ({ reserva, onDelete, onEdit }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Reserva ID: {reserva.reserva_id}</Text>
      <Text style={styles.itemText}>Laboratorio ID: {reserva.laboratorio_id}</Text>
      <Text style={styles.itemText}>Usuario ID: {reserva.usuario_id}</Text>
      <Text style={styles.itemText}>Fecha Inicio: {reserva.fecha_inicio}</Text>
      <Text style={styles.itemText}>Estado: {reserva.estado}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(reserva)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(reserva.reserva_id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: { backgroundColor: '#333333', padding: 10, marginVertical: 8, borderRadius: 5 },
  itemTitle: { color: "#ffffff", fontWeight: 'bold' },
  itemText: { color: "#ffffff" },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#1e90ff', padding: 5, borderRadius: 5, marginLeft: 10 },
  deleteButton: { backgroundColor: '#ff4444', padding: 5, borderRadius: 5, marginLeft: 10 },
  buttonText: { color: '#ffffff', fontSize: 14 },
});

export default ReservasLaboratorioItem;