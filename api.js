const BASE_API = 'http://192.168.1.3:3000';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const getUserLoanReport = async (userId) => {
  try {
    const response = await fetch(`${BASE_API}/users/${userId}/loan-report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }
    const data = await response.json();
    console.log('Datos del reporte:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user loan report:', error);
    throw error;
  }
};

export const getUserLabReservas = async (userId) => {
  try {
    const response = await fetch(`${BASE_API}/users/${userId}/lab-reservas`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }
    const data = await response.json();
    console.log('Datos del reporte de reservas y préstamos:', data);
    return data;
  } catch (error) {
    console.error('Error fetching lab reservas and loans report:', error);
    throw error;
  }
};

// Nueva función para el dashboard de admin
export const getAdminDashboardData = async () => {
  try {
    const response = await fetch(`${BASE_API}/admin/dashboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }
    const data = await response.json();
    console.log('Datos del dashboard:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

// Funciones para laboratorios
export const getLaboratories = async () => {
  try {
    const response = await fetch(`${BASE_API}/laboratorios`);
    const data = await response.json();
    console.log('Datos de laboratorios recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error fetching laboratories:', error);
    throw error;
  }
};

export const createLaboratory = async (labData) => {
  try {
    const response = await fetch(`${BASE_API}/laboratorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating laboratory:", error);
    throw error;
  }
};

export const updateLaboratory = async (id, labData) => {
  try {
    const response = await fetch(`${BASE_API}/laboratorios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating laboratory:", error);
    throw error;
  }
};

export const deleteLaboratory = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/laboratorios/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting laboratory:", error);
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

export const createEquipment = async (equipData) => {
  try {
    const response = await fetch(`${BASE_API}/equipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw error;
  }
};

export const updateEquipment = async (id, equipData) => {
  try {
    const response = await fetch(`${BASE_API}/equipos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/equipos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
};

// Corregido el typo de 'Maintenaint' a 'Maintenance'
export const getMaintenance = async () => {
  try {
    const response = await fetch(`${BASE_API}/mantenimientos`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    throw error;
  }
};

export const createMaintenance = async (maintData) => {
  try {
    const response = await fetch(`${BASE_API}/mantenimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating maintenance:", error);
    throw error;
  }
};

export const updateMaintenance = async (id, maintData) => {
  try {
    const response = await fetch(`${BASE_API}/mantenimientos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating maintenance:", error);
    throw error;
  }
};

export const deleteMaintenance = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/mantenimientos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting maintenance:", error);
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

export const createLoan = async (loanData) => {
  try {
    const response = await fetch(`${BASE_API}/prestamos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating loan:", error);
    throw error;
  }
};

export const updateLoan = async (id, loanData) => {
  try {
    const response = await fetch(`${BASE_API}/prestamos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating loan:", error);
    throw error;
  }
};

export const deleteLoan = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/prestamos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting loan:", error);
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

export const createLabReservation = async (resData) => {
  try {
    const response = await fetch(`${BASE_API}/reservas_laboratorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating lab reservation:", error);
    throw error;
  }
};

export const updateLabReservation = async (id, resData) => {
  try {
    const response = await fetch(`${BASE_API}/reservas_laboratorios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating lab reservation:", error);
    throw error;
  }
};

export const deleteLabReservation = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/reservas_laboratorios/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting lab reservation:", error);
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

export const createEquipmentCategory = async (catData) => {
  try {
    const response = await fetch(`${BASE_API}/categoria_equipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating equipment category:", error);
    throw error;
  }
};

export const updateEquipmentCategory = async (id, catData) => {
  try {
    const response = await fetch(`${BASE_API}/categoria_equipos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating equipment category:", error);
    throw error;
  }
};

export const deleteEquipmentCategory = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/categoria_equipos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting equipment category:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
      const response = await fetch(`${BASE_API}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error registering user:", error);
      throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
      const response = await fetch(`${BASE_API}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error logging in:", error);
      throw error;
  }
};