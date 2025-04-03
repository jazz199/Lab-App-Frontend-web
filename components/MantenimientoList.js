import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MantenimientoItem from './MantenimientoItem'

const MantenimientoList = ({ mantenimiento }) => {
    const renderItem = ({ item }) => {
        return <MantenimientoItem mantenimiento={item}/>;
    };

    console.log('Datos de mantenimiento recibidos MantenimientoList:', mantenimiento);
      return (
        <View>
          <FlatList
          style={{ width: '100%'}}
            data={mantenimiento}
            keyExtractor={(item) => item.id + ""}
            renderItem={renderItem}
            
          />
        </View>
      );
};

export default MantenimientoList