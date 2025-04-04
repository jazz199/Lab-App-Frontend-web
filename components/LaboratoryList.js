// FILE: components/LaboratoryList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import LaboratoryItem from './LaboratoryItem';

const LaboratoryList = ({ laboratories, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <LaboratoryItem laboratory={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Laboratorios recibidos en LaboratoryList:', laboratories);

  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={laboratories}
        keyExtractor={(item, index) => item.laboratorio_id ? item.laboratorio_id.toString() : `index-${index}`}
        renderItem={renderItem}
      />
    </View>
  );
};

export default LaboratoryList;