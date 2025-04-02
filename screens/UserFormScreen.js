import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import { getUsers } from '../api.js';
import Layout from '../components/layout.js';
import UserList from '../components/UserList.js'


const UsersFormScreen = () => {
  const [users, setUsers] = useState ([]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error){
      console.error('Error en load Users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10}}>Usuarios</Text>
      <UserList users={users}/>
    </Layout>
  );
}
export default UsersFormScreen;