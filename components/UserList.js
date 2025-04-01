import React from 'react';
import { View, Text, FlatList } from 'react-native';
import UserItem from './userItem'


const UserList = ({ users }) => {

    const renderItem = ({ item }) => {
        return <UserItem user={item}/>;
    };


  console.log('Usuarios recibidos en UserList:', users);
  return (
    <View>
      <FlatList
      style={{ width: '100%'}}
        data={users}
        keyExtractor={(item) => item.id + ""}
        renderItem={renderItem}
        
      />
    </View>
  );
};

export default UserList;