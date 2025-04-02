import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const EquipmentItem = ({ equipment }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{equipment.nombre}</Text>
      <Text style={styles.itemText}>Código: {equipment.codigo_inventario}</Text>
      <Text style={styles.itemText}>Estado: {equipment.estado}</Text>
      <Text style={styles.itemText}>Descripción: {equipment.descripcion}</Text>
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

export default EquipmentItem;