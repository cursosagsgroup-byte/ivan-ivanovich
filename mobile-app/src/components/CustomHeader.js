
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function CustomHeader({ navigation, back }) {
    const insets = useSafeAreaInsets();
    const [language, setLanguage] = useState('ES');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ES' ? 'EN' : 'ES');
        // Here you would also trigger the global language context update
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>
                {/* Left Side: Back Button OR Logo */}
                <View style={styles.leftContainer}>
                    {back ? (
                        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
                            <ChevronLeft color="#0f172a" size={28} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>

                {/* Right Side: Language Switcher */}
                <TouchableOpacity style={styles.rightItem} onPress={toggleLanguage}>
                    <Text style={styles.langText}>{language}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerContent: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    logoContainer: {
        justifyContent: 'center',
    },
    backButton: {
        padding: 4,
        marginLeft: -8, // Align closer to edge visually
    },
    rightItem: {
        width: 60,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    logoImage: {
        width: 140,
        height: 38,
    },
    langText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
    }
});
