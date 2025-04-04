const BASE_API = 'http://192.168.1.3:3000';

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

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${BASE_API}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/users/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
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


export const getMaintenaint = async () => {
  try {
    const response = await fetch(`${BASE_API}/mantenimientos`); // Changed from /mantenimiento to /mantenimientos
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Mantenimiento:', error);
    throw error;
  }
};

export const getLoans = async () => {
  try {
    const response = await fetch(`${BASE_API}/prestamos`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

export const getLabReservations = async () => {
  try {
    const response = await fetch(`${BASE_API}/reservas_laboratorios`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lab reservations:', error);
    throw error;
  }
};

export const getEquipmentCategories = async () => {
  try {
    const response = await fetch(`${BASE_API}/categoria_equipos`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment categories:', error);
    throw error;
  }
};