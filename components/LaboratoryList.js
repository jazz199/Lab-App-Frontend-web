import React from 'react';
import { View, FlatList } from 'react-native';
import LaboratoryItem from './LaboratoryItem';

const LaboratoryList = ({ laboratories }) => {
  const renderItem = ({ item }) => {
    return <LaboratoryItem laboratory={item} />;
  };

  console.log('Laboratorios recibidos en LaboratoryList:', laboratories);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={laboratories}
        keyExtractor={(item) => item.laboratorio_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default LaboratoryList;