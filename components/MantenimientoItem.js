// FILE: components/MantenimientoItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MantenimientoItem = ({ mantenimiento, onDelete, onEdit }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Costo: {mantenimiento.costo}</Text>
      <Text style={styles.itemText}>Descripción: {mantenimiento.descripcion}</Text>
      <Text style={styles.itemText}>Equipo ID: {mantenimiento.equipo_id}</Text>
      <Text style={styles.itemText}>Fecha Inicio: {mantenimiento.fecha_inicio}</Text>
      <Text style={styles.itemText}>Fecha Fin: {mantenimiento.fecha_fin}</Text>
      <Text style={styles.itemText}>Técnico: {mantenimiento.tecnico}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(mantenimiento)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(mantenimiento.mantenimiento_id)}>
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

export default MantenimientoItem;