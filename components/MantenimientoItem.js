import React from "react";
import { View, Text, StyleSheet} from 'react-native'

const MantenimientoItem = ({mantenimiento}) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitel}>{mantenimiento.costo}</Text>
            <Text style={styles.itemTitel}>{mantenimiento.descripcion}</Text>
            <Text style={styles.itemTitel}>{mantenimiento.equipo_id}</Text>
            <Text style={styles.itemTitel}>{mantenimiento.fecha_inicio}</Text>
            <Text style={styles.itemTitel}>{mantenimiento.fecha_fin}</Text>
            <Text style={styles.itemTitel}>{mantenimiento.tecnico}</Text>
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

export default MantenimientoItem;
