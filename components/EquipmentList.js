import React from 'react';
import { View, FlatList } from 'react-native';
import EquipmentItem from './EquipmentItem';

const EquipmentList = ({ equipment }) => {
  const renderItem = ({ item }) => {
    return <EquipmentItem equipment={item} />;
  };

  console.log('Equipos recibidos en EquipmentList:', equipment);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={equipment}
        keyExtractor={(item) => item.equipo_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default EquipmentList;