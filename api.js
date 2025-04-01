const API = 'http://192.168.1.3:3000/users';

export const getUsers = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };