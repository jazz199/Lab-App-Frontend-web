// FILE: components/CategoriaEquiposList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import CategoriaEquiposItem from './CategoriaEquiposItem';

const CategoriaEquiposList = ({ categorias, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <CategoriaEquiposItem categoria={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Categorías recibidas en CategoriaEquiposList:', categorias);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={categorias}
        keyExtractor={(item) => item.categoria_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CategoriaEquiposList;