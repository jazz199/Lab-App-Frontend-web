import React from 'react';
import { View, FlatList } from 'react-native';
import PrestamosItem from './PrestamosItem';

const PrestamosList = ({ prestamos }) => {
  const renderItem = ({ item }) => {
    return <PrestamosItem prestamo={item} />;
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