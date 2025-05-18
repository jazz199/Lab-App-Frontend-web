import React from 'react';
import { View, FlatList } from 'react-native';
import UserLabReportItem from './UserLabReportItem';

const UserLabReportList = ({ reservas }) => {
  const renderItem = ({ item }) => {
    return <UserLabReportItem reserva={item} />;
  };

  console.log('Reservas recibidas en UserLabReportList:', reservas); // Debug log
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={reservas}
        keyExtractor={(item) => item.reserva_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UserLabReportList;