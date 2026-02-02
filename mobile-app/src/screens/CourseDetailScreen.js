
import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayCircle, CheckCircle, Lock } from 'lucide-react-native';

export default function CourseDetailScreen({ route, navigation }) {
    const { course } = route.params;

    // Transform modules to SectionList format
    const sections = course.modules.map(mod => ({
        title: mod.title,
        data: mod.lessons
    }));

    const renderLesson = ({ item, index, section }) => {
        // Simple logic: If it's the first lesson OR previous was completed, it's unlocked
        // (This is handled by backend usually, but for UI:)
        // We received 'isCompleted' from backend.
        // We can just trust the user can click any video for now or check strictly.
        // Let's allow access to all for better UX in MVP unless verified strictness needed.

        return (
            <TouchableOpacity
                style={styles.lessonItem}
                onPress={() => navigation.navigate('Player', { lesson: item })}
            >
                <View style={styles.lessonIcon}>
                    {item.isCompleted ? (
                        <CheckCircle size={20} color="#10b981" />
                    ) : (
                        <PlayCircle size={20} color={item.isCompleted ? '#94a3b8' : '#B70126'} />
                    )}
                </View>
                <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{item.title}</Text>
                    <Text style={styles.lessonDuration}>{Math.round(item.duration / 60)} min</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id + index}
                renderItem={renderLesson}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.list}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    list: {
        padding: 20,
        gap: 10,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    lessonIcon: {
        marginRight: 16,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
    },
    lessonDuration: {
        color: '#64748b',
        fontSize: 12,
    },
});
