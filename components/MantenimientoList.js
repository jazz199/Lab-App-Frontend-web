// FILE: components/MantenimientoList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import MantenimientoItem from './MantenimientoItem';

const MantenimientoList = ({ mantenimiento, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <MantenimientoItem mantenimiento={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Datos de mantenimiento recibidos MantenimientoList:', mantenimiento);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={mantenimiento}
        keyExtractor={(item) => item.mantenimiento_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MantenimientoList;