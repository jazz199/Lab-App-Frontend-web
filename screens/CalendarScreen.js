import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import * as Calendar from 'expo-calendar';
import moment from 'moment-timezone';
import { getCalendarEvents } from '../api';

// Importa un calendario web visual si es web
import { Calendar as WebCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarId, setCalendarId] = useState(null);

    // Solicitar permisos y configurar calendario solo en móvil
    useEffect(() => {
        if (Platform.OS !== 'web') {
            const setupCalendar = async () => {
                try {
                    if (!Calendar || !Calendar.requestCalendarPermissionsAsync) {
                        throw new Error('Módulo expo-calendar no está disponible');
                    }
                    const { status } = await Calendar.requestCalendarPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Permiso denegado', 'Se necesita acceso al calendario para agregar eventos.');
                        setError('Permiso de calendario denegado');
                        return;
                    }
                    const calendars = await Calendar.getCalendarsAsync();
                    let targetCalendar = calendars.find(cal => cal.title === 'Laboratorios USB' && cal.allowsModifications);
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
        }
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
        fetchEvents();
    }, []);

    // Agregar evento al calendario nativo (solo móvil)
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

    // Render para web: calendario visual
    if (Platform.OS === 'web') {
        const webEvents = events.map(ev => ({
            ...ev,
            start: new Date(ev.start),
            end: new Date(ev.end),
            allDay: false,
            resource: ev,
        }));

        return (
            <View style={webStyles.webContainer}>
                <Text style={webStyles.webHeader}>Calendario de Laboratorios</Text>
                <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 12px #0002', width: '100%', maxWidth: 1100, margin: '0 auto' }}>
                    <WebCalendar
                        localizer={localizer}
                        events={webEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600, background: '#fff', borderRadius: 8 }}
                        eventPropGetter={event => ({
                            style: {
                                backgroundColor: {
                                    cancelada: '#d9534f',
                                    activa: '#5cb85c',
                                    aprobada: '#5cb85c',
                                    atrasado: '#f0ad4e',
                                    devuelto: '#777',
                                    unknown: '#3174ad'
                                }[event.status?.toLowerCase()] || '#3174ad',
                                color: '#fff',
                                borderRadius: 6,
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: 15,
                                padding: 2,
                            }
                        })}
                        tooltipAccessor={event => event.description}
                        popup
                        messages={{
                            next: "Sig.",
                            previous: "Ant.",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día",
                            agenda: "Agenda",
                            showMore: total => `+${total} más`
                        }}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: 18, color: '#3174ad', fontWeight: 500 }}>
                    Haz clic en un evento para ver detalles.
                </div>
            </View>
        );
    }

    // Render para móvil/tablet (FlatList)
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
                renderItem={({ item }) => {
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
                }}
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

// Estilos para web
const webStyles = {
    webContainer: {
        width: '100%',
        minHeight: '100vh',
        background: '#f4f6fa',
        padding: 0,
        margin: 0,
    },
    webHeader: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3174ad',
        textAlign: 'center',
        margin: '32px 0 24px 0',
        letterSpacing: 1,
    }
};

export default CalendarScreen;