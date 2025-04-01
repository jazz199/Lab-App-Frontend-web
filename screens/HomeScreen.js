import React, {useEffect, useState } from 'react';
import { View, Text} from 'react-native';
import { getUsers } from '../api';
import Layout from '../components/layout'
import UserList from '../components/UserList';



const HomeScreen = () => {
    
  const [users, setUsers] = useState([])

    const loadUser = async () => {
      try {
        const data = await getUsers();
        console.log('Datos recibidos de la API:', data);
        setUsers(data);
      } catch (error) {
        console.error('Error en loadUser:', error);
      }
    };

    useEffect(() => {
        loadUser();
    }, [])

    return (
      <Layout>
        <UserList users={users} />
      </Layout>
    );
}
export default HomeScreen;