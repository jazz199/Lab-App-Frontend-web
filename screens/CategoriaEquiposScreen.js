import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getEquipmentCategories } from '../api';
import Layout from '../components/layout';
import CategoriaEquiposList from '../components/CategoriaEquiposList';

const CategoriaEquiposScreen = () => {
  const [categorias, setCategorias] = useState([]);

  const loadCategorias = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Error en loadCategorias:', error);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  return (
    <Layout>
      <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10 }}>
        Lista de Categorías de Equipos
      </Text>
      <CategoriaEquiposList categorias={categorias} />
    </Layout>
  );
};

export default CategoriaEquiposScreen;