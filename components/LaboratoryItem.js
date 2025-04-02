import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const LaboratoryItem = ({ laboratory }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{laboratory.nombre}</Text>
      <Text style={styles.itemText}>Ubicación: {laboratory.ubicacion}</Text>
      <Text style={styles.itemText}>Tipo: {laboratory.tipo_laboratorio}</Text>
      <Text style={styles.itemText}>Capacidad: {laboratory.capacidad}</Text>
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

export default LaboratoryItem;