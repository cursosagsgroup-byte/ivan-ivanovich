
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Linking, Alert, Platform } from 'react-native';
import { getItem, deleteItem } from '../utils/storage';
import { API_URL, BASE_URL } from '../config';
import { PlayCircle, Award, LogOut } from 'lucide-react-native';

export default function DashboardScreen({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchCourses();
        loadUser();

        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await getItem('user_data');
        if (userData) setUser(JSON.parse(userData));
    };

    const handleLogout = async () => {
        await deleteItem('user_token');
        await deleteItem('user_data');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const fetchCourses = async () => {
        try {
            const token = await getItem('user_token');
            const response = await fetch(`${API_URL}/courses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchCourses();
    }, []);

    const getCustomImageStyle = (title) => {
        if (!title) return {};

        // "La team subela mas" -> Move Image UP (negative Y) to show bottom? 
        // Or "Subela" means "Raise the subject"? 
        // User said: "Team Leader subela mas" (Show more bottom logic usually implies moving image up)
        // Let's assume TranslateY negative.
        if (title.includes('Team Leader')) {
            return {
                height: 220, // Increase height to allow movement without gap
                transform: [{ translateY: -30 }]
            };
        }

        // "La de contra bajala mas" -> Move Image DOWN (positive Y) to show top.
        if (title.includes('Contravigilancia')) {
            return {
                height: 220,
                transform: [{ translateY: 20 }]
            };
        }

        return {};
    };

    const handleDownloadCertificate = async (url) => {
        if (!url) {
            Alert.alert('Aviso', 'El certificado se está generando. Intenta más tarde.');
            return;
        }

        try {
            // Check if supported (mostly for native, web usually supports http/https)
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'No se puede abrir este enlace: ' + url);
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Hubo un problema al intentar abrir el certificado.');
            // Fallback for web if Linking fails for some reason
            if (Platform.OS === 'web') {
                window.open(url, '_blank');
            }
        }
    };

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
        >
            <Image
                source={{ uri: item.imageUrl?.startsWith('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}` }}
                style={[styles.cardImage, getCustomImageStyle(item.title)]}
            />
            <View style={[styles.cardContent, item.title.includes('Contravigilancia') && { paddingTop: 36 }]}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{item.progress}% Completado</Text>
                </View>

                {item.isCompleted && (
                    <TouchableOpacity
                        style={styles.badge}
                        onPress={() => handleDownloadCertificate(item.certificateUrl)}
                    >
                        <Award size={16} color="#fbbf24" />
                        <Text style={styles.badgeText}>Descargar Certificado</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#B70126" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0]}</Text>
                <Text style={styles.subtext}>Continúa tu entrenamiento</Text>
            </View>

            <FlatList
                data={courses}
                renderItem={renderCourseItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes cursos inscritos aún.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtext: {
        fontSize: 16,
        color: '#94a3b8',
    },
    list: {
        padding: 20,
        gap: 20,
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    progressContainer: {
        gap: 6,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#334155',
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#B70126',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'right',
    },
    badge: {
        flexDirection: 'row',
        items: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        padding: 8,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: 'flex-start',
        gap: 6,
    },
    badgeText: {
        color: '#fbbf24',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 40,
    }
});
