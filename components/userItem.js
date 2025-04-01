import React from "react";
import { View, Text, StyleSheet} from 'react-native'

const UserItem = ({user}) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitel}>{user.nombre}</Text>
            <Text style={styles.itemTitel}>{user.apellido}</Text>
            <Text style={styles.itemTitel}>{user.email}</Text>
            <Text style={styles.itemTitel}>{user.numero_identificacion}</Text>
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