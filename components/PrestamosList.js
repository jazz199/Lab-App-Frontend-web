// FILE: components/PrestamosList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import PrestamosItem from './PrestamosItem';

const PrestamosList = ({ prestamos, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <PrestamosItem prestamo={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Préstamos recibidos en PrestamosList:', prestamos);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={prestamos}
        keyExtractor={(item) => item.prestamo_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PrestamosList;