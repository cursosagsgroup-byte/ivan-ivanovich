
import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PlayerScreen({ route }) {
    const { lesson } = route.params;
    const [loading, setLoading] = useState(true);

    // Helper to extract Vimeo ID
    const getVimeoId = (url) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
    };

    const vimeoId = getVimeoId(lesson.videoUrl || '');

    if (!vimeoId) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Video no disponible</Text>
            </View>
        );
    }

    // Construct embed URL
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#B70126" />
                    </View>
                )}
                <WebView
                    style={styles.webview}
                    source={{
                        uri: embedUrl,
                        headers: {
                            'Referer': 'https://cursosagsgroup.com/' // Spoof referer for Vimeo privacy
                        }
                    }}
                    allowsFullscreenVideo
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoadEnd={() => setLoading(false)}
                />
            </View>

            <View style={styles.info}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>
                    {lesson.description ? lesson.description.replace(/<[^>]+>/g, '') : 'Sin descripción'}
                </Text>
            </View>
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
    },
    videoContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        zIndex: 1,
    },
    info: {
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#94a3b8',
        lineHeight: 24,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
    }
});
