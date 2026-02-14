import { CourseContext } from '@/app/context/courseContext'
import { Colors } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useContext } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Bookmarks() {
    const context = useContext(CourseContext)
    const router = useRouter()

    if (!context) {
        return null
    }

    const { courses, bookmarkedCourses, toggleBookmark } = context

    const bookmarkedCoursesList = courses.filter(course => 
        bookmarkedCourses.includes(course.id)
    )

    const handleCoursePress = (courseId: string) => {
        router.push(`/screen/courses/${courseId}` as any)
    }

    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCoursePress(item.id)}
        >
            <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.courseContent}>
                <View style={styles.courseHeader}>
                    <View style={styles.instructorInfo}>
                        <Image
                            source={{ uri: item.instructor.avatar }}
                            style={styles.instructorAvatar}
                        />
                        <Text style={styles.instructorName}>{item.instructor.name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleBookmark(item.id)}
                        style={styles.bookmarkButton}
                    >
                        <Ionicons
                            name="bookmark"
                            size={24}
                            color={Colors.light.tint}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.courseDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.courseFooter}>
                    <Text style={styles.courseCategory}>{item.category}</Text>
                    <Text style={styles.coursePrice}>${item.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookmarks</Text>
                <Text style={styles.headerSubtitle}>
                    {bookmarkedCoursesList.length} {bookmarkedCoursesList.length === 1 ? 'course' : 'courses'} saved
                </Text>
            </View>
            <FlatList
                data={bookmarkedCoursesList}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bookmark-outline" size={64} color={Colors.light.icon} />
                        <Text style={styles.emptyText}>No bookmarks yet</Text>
                        <Text style={styles.emptySubtext}>
                            Start bookmarking courses to save them for later
                        </Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#687076',
    },
    listContent: {
        padding: 16,
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    courseContent: {
        padding: 16,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    instructorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#E5E7EB',
    },
    instructorName: {
        fontSize: 14,
        color: '#687076',
        fontWeight: '500',
    },
    bookmarkButton: {
        padding: 4,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 8,
    },
    courseDescription: {
        fontSize: 14,
        color: '#687076',
        lineHeight: 20,
        marginBottom: 12,
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseCategory: {
        fontSize: 12,
        color: Colors.light.tint,
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: '600',
    },
    coursePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.tint,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#11181C',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#687076',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
})
