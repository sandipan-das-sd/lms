import { CourseContext } from '@/app/context/courseContext'
import { Colors } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useContext } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function CourseList() {
    const context = useContext(CourseContext)
    const router = useRouter()

    if (!context) {
        return null
    }

    const {
        filteredCourses,
        loading,
        refreshing,
        refreshCourses,
        toggleBookmark,
        isBookmarked,
        searchQuery,
        setSearchQuery
    } = context

    const handleCoursePress = (courseId: string) => {
        console.log('Navigating to course ID:', courseId)
        router.push(`/screen/courses/${courseId}` as any)
    }

    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCoursePress(item.id)}
        >
            <Image
                source={{ uri: item.thumbnail || 'https://via.placeholder.com/600x300/667eea/ffffff?text=Course' }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.courseContent}>
                <View style={styles.courseHeader}>
                    <View style={styles.instructorInfo}>
                        <Image
                            source={{ uri: item.instructor.avatar || 'https://via.placeholder.com/40/667eea/ffffff?text=' + (item.instructor.name?.[0] || 'U') }}
                            style={styles.instructorAvatar}
                        />
                        <Text style={styles.instructorName}>{item.instructor.name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleBookmark(item.id)}
                        style={styles.bookmarkButton}
                    >
                        <Ionicons
                            name={isBookmarked(item.id) ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color={isBookmarked(item.id) ? Colors.light.tint : Colors.light.icon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.courseDescription} numberOfLines={3}>{item.description}</Text>
                <View style={styles.courseFooter}>
                    <Text style={styles.courseCategory}>{item.category}</Text>
                    <Text style={styles.coursePrice}>${item.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    if (loading && filteredCourses.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
                <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover Courses</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={Colors.light.icon} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={Colors.light.icon} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            <FlatList
                data={filteredCourses}
                renderItem={renderCourseItem}
                keyExtractor={(item, index) => item.id || `course-${index}`}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshCourses}
                        colors={[Colors.light.tint]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="school-outline" size={64} color={Colors.light.icon} />
                        <Text style={styles.emptyText}>No courses found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try a different search term' : 'Pull down to refresh'}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.icon,
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#11181C',
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
        height: 200,
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
    },
})
