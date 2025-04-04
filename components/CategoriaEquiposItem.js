import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const CategoriaEquiposItem = ({ categoria }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{categoria.nombre}</Text>
      <Text style={styles.itemText}>ID: {categoria.categoria_id}</Text>
      <Text style={styles.itemText}>Descripción: {categoria.descripcion}</Text>
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

export default CategoriaEquiposItem;