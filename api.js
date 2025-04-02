const BASE_API = 'http://id del equipo:3000';

// Funciones para usuarios
export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_API}/users`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Funciones para laboratorios
export const getLaboratories = async () => {
  try {
    const response = await fetch(`${BASE_API}/laboratorios`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching laboratories:', error);
    throw error;
  }
};

// Funciones para equipos
export const getEquipment = async () => {
  try {
    const response = await fetch(`${BASE_API}/equipos`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};