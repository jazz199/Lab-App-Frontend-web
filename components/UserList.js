// FILE: components/UserList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import UserItem from './userItem';

const UserList = ({ users, onDelete, onEdit }) => {
  const renderItem = ({ item }) => {
    return <UserItem user={item} onDelete={onDelete} onEdit={onEdit} />;
  };

  console.log('Usuarios recibidos en UserList:', users);
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        data={users}
        keyExtractor={(item) => item.usuario_id + ""}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UserList;