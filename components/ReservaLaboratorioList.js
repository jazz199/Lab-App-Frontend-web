// FILE: components/ReservaLaboratorioList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import ReservasLaboratorioItem from './ReservasLaboratorioItem';

const ReservasLaboratorioList = ({ reservas, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <ReservasLaboratorioItem reserva={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Reservas recibidas en ReservasLaboratorioList:', reservas);
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

export default ReservasLaboratorioList;