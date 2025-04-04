import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserItem = ({ user, onDelete, onEdit }) => {
    return (
    <View style={styles.itemContainer}>
        <View style={styles.itemContainer}>
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
        backgroundColor: '#333333',
        padding: 10,
        marginVertical: 8,
        borderRadius: 5
    },
    itemTitel: {
        color: "#ffffff"
    }
})

export default UserItem;