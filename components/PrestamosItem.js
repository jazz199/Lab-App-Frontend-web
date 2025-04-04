import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const PrestamosItem = ({ prestamo }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Préstamo ID: {prestamo.prestamo_id}</Text>
      <Text style={styles.itemText}>Usuario ID: {prestamo.usuario_id}</Text>
      <Text style={styles.itemText}>Equipo ID: {prestamo.equipo_id}</Text>
      <Text style={styles.itemText}>Fecha Préstamo: {prestamo.fecha_prestamo}</Text>
      <Text style={styles.itemText}>Estado: {prestamo.estado}</Text>
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

export default PrestamosItem;