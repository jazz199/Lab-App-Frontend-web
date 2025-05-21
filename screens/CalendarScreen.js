import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import moment from 'moment-timezone';
import { getCalendarEvents } from '../api';

const CalendarScreen = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarId, setCalendarId] = useState(null);

    // Solicitar permisos y configurar calendario
    useEffect(() => {
        const setupCalendar = async () => {
            try {
                // Verificar que Calendar esté correctamente importado
                if (!Calendar || !Calendar.requestCalendarPermissionsAsync) {
                    throw new Error('Módulo expo-calendar no está disponible');
                }

                // Solicitar permisos de calendario
                const { status } = await Calendar.requestCalendarPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permiso denegado', 'Se necesita acceso al calendario para agregar eventos.');
                    setError('Permiso de calendario denegado');
                    return;
                }

                // Obtener calendarios disponibles
                const calendars = await Calendar.getCalendarsAsync();
                let targetCalendar = calendars.find(cal => cal.title === 'Laboratorios USB' && cal.allowsModifications);

                // Crear calendario si no existe
                if (!targetCalendar) {
                    const defaultCalendarSource = Platform.OS === 'android'
                        ? { isLocalAccount: true, name: 'Laboratorios USB', type: 'LOCAL' }
                        : calendars.find(cal => cal.source?.type === 'LOCAL')?.source || { isLocalAccount: true, name: 'Laboratorios USB' };

                    const newCalendar = {
                        title: 'Laboratorios USB',
                        color: '#3174ad',
                        entityType: 'event',
                        source: defaultCalendarSource,
                        name: 'laboratorios_usb',
                        ownerAccount: 'local',
                        accessLevel: 'owner',
                        allowedAvailabilities: ['busy', 'free']
                    };

                    const newCalendarId = await Calendar.createCalendarAsync(newCalendar);
                    targetCalendar = await Calendar.getCalendarAsync(newCalendarId);
                }

                setCalendarId(targetCalendar.id);
            } catch (error) {
                console.error('Error configurando calendario:', error);
                setError(`Error al configurar calendario: ${error.message}`);
            }
        };

        setupCalendar();
    }, []);

    // Obtener eventos del backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventData = await getCalendarEvents();
                const formattedEvents = eventData.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    start: moment(event.start).tz('America/Caracas').toDate(),
                    end: moment(event.end).tz('America/Caracas').isSame(moment(event.start))
                        ? moment(event.end).tz('America/Caracas').add(1, 'hour').toDate()
                        : moment(event.end).tz('America/Caracas').toDate(),
                    status: event.description.match(/Estado: (\w+)/)?.[1] || 'unknown'
                }));

                setEvents(formattedEvents);
                setLoading(false);
            } catch (error) {
                console.error('Error obteniendo eventos:', error);
                setError(`Error al obtener eventos: ${error.message}`);
                setLoading(false);
            }
        };

        if (calendarId) {
            fetchEvents();
        }
    }, [calendarId]);

    // Agregar evento al calendario nativo
    const addEventToCalendar = async (event) => {
        if (!calendarId) {
            Alert.alert('Error', 'No se ha configurado el calendario.');
            return;
        }

        try {
            const eventDetails = {
                calendarId,
                title: event.title,
                startDate: event.start,
                endDate: event.end,
                notes: event.description,
                availability: 'busy',
                timeZone: 'America/Caracas'
            };

            await Calendar.createEventAsync(calendarId, eventDetails);
            Alert.alert('Éxito', 'Evento agregado al calendario nativo.');
        } catch (error) {
            console.error('Error agregando evento al calendario:', error);
            Alert.alert('Error', `No se pudo agregar el evento: ${error.message}`);
        }
    };

    const renderEvent = ({ item }) => {
        const statusColor = {
            cancelada: '#d9534f',
            activa: '#5cb85c',
            aprobada: '#5cb85c',
            atrasado: '#f0ad4e',
            devuelto: '#777',
            unknown: '#3174ad'
        }[item.status.toLowerCase()] || '#3174ad';

        return (
            <TouchableOpacity
                style={[styles.item, { borderLeftColor: statusColor }]}
                onPress={() => addEventToCalendar(item)}
            >
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>
                    {`${moment(item.start).format('DD/MM/YYYY HH:mm')} - ${moment(item.end).format('HH:mm')}`}
                </Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemAction}>Toca para agregar al calendario</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando eventos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Eventos de Laboratorios</Text>
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#3174ad'
    },
    list: {
        paddingHorizontal: 10
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderLeftWidth: 5,
        elevation: 2
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    itemTime: {
        fontSize: 14,
        color: '#666',
        marginVertical: 3
    },
    itemDescription: {
        fontSize: 13,
        color: '#888'
    },
    itemAction: {
        fontSize: 12,
        color: '#3174ad',
        marginTop: 5,
        fontStyle: 'italic'
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    }
});

export default CalendarScreen;