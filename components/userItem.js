import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserItem = ({ user, onDelete, onEdit }) => {
    return (
    <View style={styles.itemContainer}>
        <View>
            <Text style={styles.itemTitel}>{user.nombre}</Text>
            <Text style={styles.itemTitel}>{user.apellido}</Text>
            <Text style={styles.itemTitel}>{user.email}</Text>
            <Text style={styles.itemTitel}>{user.numero_identificacion}</Text>
        </View>
        <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => onEdit(user)}>
            <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(user.usuario_id)}>
            <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles =StyleSheet.create({
    itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    itemTitel: {
        color: "#ffffff"
    },buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
      },
      editButton: {
        backgroundColor: '#1e90ff',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
      },
      deleteButton: {
        backgroundColor: '#ff4444',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 14,
      },
    
})

export default UserItem;