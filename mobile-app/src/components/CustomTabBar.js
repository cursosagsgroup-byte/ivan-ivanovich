
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, LogOut, MessageCircle, BookOpen } from 'lucide-react-native';
import { deleteItem } from '../utils/storage';

const TAB_HEIGHT = 60;
const PROTRUSION_RADIUS = 35;

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        await deleteItem('user_token');
        // Reset navigation to Login
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {/* Background Shape specifically for protrusion effect could be SVG, 
                but for simplicity and performance we use absolute positioning logic here */}

            <View style={styles.bar}>
                {/* Left Action: Shop */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLink('https://ivanivanovich.com/educacion/cursos-online')}
                >
                    <ShoppingCart color="#334155" size={24} />
                    <Text style={styles.actionLabel}>Tienda</Text>
                </TouchableOpacity>

                {/* Left Action: Chat */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLink('https://ivanivanovich.com')} // Placeholder for chat bot
                >
                    <MessageCircle color="#334155" size={24} />
                    <Text style={styles.actionLabel}>Chat</Text>
                </TouchableOpacity>

                {/* Center Space for Protrusion */}
                <View style={{ width: PROTRUSION_RADIUS * 2 }} />

                {/* Right Action: Blog */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLink('https://ivanivanovich.com/blog')}
                >
                    <BookOpen color="#334155" size={24} />
                    <Text style={styles.actionLabel}>Blog</Text>
                </TouchableOpacity>

                {/* Right Action: Logout */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLogout}
                >
                    <LogOut color="#ef4444" size={24} />
                    <Text style={[styles.actionLabel, { color: '#ef4444' }]}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/* Protruding Center Button (Profile) */}
            <View style={styles.centerButtonContainer} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.centerButton}
                    onPress={() => navigation.navigate('Dashboard')} // Or Profile screen if it exists
                    activeOpacity={0.9}
                >
                    {/* Profile Picture Placeholder */}
                    <View style={styles.profilePlaceholder}>
                        <Text style={styles.profileText}>YO</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height: TAB_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingHorizontal: 10,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        minWidth: 50,
    },
    actionLabel: {
        color: '#334155',
        fontSize: 10,
        fontWeight: '500',
        marginTop: 4,
    },
    centerButtonContainer: {
        position: 'absolute',
        top: -30, // Protrude upwards
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFFFFF', // Match bar background
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    profilePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
