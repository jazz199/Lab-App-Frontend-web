// FILE: components/PrestamosItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PrestamosItem = ({ prestamo, onDelete, onEdit }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Préstamo ID: {prestamo.prestamo_id}</Text>
      <Text style={styles.itemText}>Usuario ID: {prestamo.usuario_id}</Text>
      <Text style={styles.itemText}>Equipo ID: {prestamo.equipo_id}</Text>
      <Text style={styles.itemText}>Fecha Préstamo: {prestamo.fecha_prestamo}</Text>
      <Text style={styles.itemText}>Estado: {prestamo.estado}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(prestamo)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(prestamo.prestamo_id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', },
  itemTitle: { color: "#ffffff", fontWeight: 'bold' },
  itemText: { color: "#ffffff" },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#1e90ff', padding: 5, borderRadius: 5, marginLeft: 10 },
  deleteButton: { backgroundColor: '#ff4444', padding: 5, borderRadius: 5, marginLeft: 10 },
  buttonText: { color: '#ffffff', fontSize: 14 },
});

export default PrestamosItem;