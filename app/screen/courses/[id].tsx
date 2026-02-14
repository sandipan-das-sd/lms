import { CourseContext } from '@/app/context/courseContext'
import { Colors } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function CourseDetails() {
    const params = useLocalSearchParams()
    const id = params.id as string
    const router = useRouter()
    const context = useContext(CourseContext)
    const [enrolling, setEnrolling] = useState(false)

    console.log('CourseDetails - Received ID:', id)
    console.log('CourseDetails - Params:', params)

    if (!context) {
        return null
    }

    const {
        getCourseById,
        toggleBookmark,
        isBookmarked,
        enrollCourse,
        isEnrolled
    } = context

    const course = getCourseById(id as string)

    if (!course) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={Colors.light.icon} />
                <Text style={styles.errorText}>Course not found</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleEnroll = async () => {
        if (isEnrolled(course.id)) {
            Alert.alert('Already Enrolled', 'You are already enrolled in this course')
            return
        }

        setEnrolling(true)
        try {
            await enrollCourse(course.id)
            Alert.alert(
                'Success!',
                'You have successfully enrolled in this course',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            )
        } catch (error) {
            Alert.alert('Error', 'Failed to enroll in course. Please try again.')
        } finally {
            setEnrolling(false)
        }
    }

    const enrolled = isEnrolled(course.id)
    const bookmarked = isBookmarked(course.id)

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: course.thumbnail || 'https://via.placeholder.com/800x400/667eea/ffffff?text=Course' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.backIconButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bookmarkIconButton}
                        onPress={() => toggleBookmark(course.id)}
                    >
                        <Ionicons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.instructorSection}>
                        <Image
                            source={{ uri: course.instructor.avatar || 'https://via.placeholder.com/100/667eea/ffffff?text=' + (course.instructor.name?.[0] || 'I') }}
                            style={styles.instructorAvatarLarge}
                        />
                        <View style={styles.instructorDetails}>
                            <Text style={styles.instructorLabel}>Instructor</Text>
                            <Text style={styles.instructorNameLarge}>{course.instructor.name}</Text>
                        </View>
                    </View>

                    <Text style={styles.courseTitle}>{course.title}</Text>

                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="pricetag" size={20} color={Colors.light.tint} />
                            <Text style={styles.metaText}>{course.category}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="people" size={20} color={Colors.light.tint} />
                            <Text style={styles.metaText}>{course.stock} seats left</Text>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Course Price</Text>
                        <Text style={styles.price}>${course.price}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About This Course</Text>
                        <Text style={styles.description}>{course.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What You'll Learn</Text>
                        <View style={styles.bulletPoint}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.light.tint} />
                            <Text style={styles.bulletText}>Master the fundamentals and advanced concepts</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.light.tint} />
                            <Text style={styles.bulletText}>Build real-world projects</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.light.tint} />
                            <Text style={styles.bulletText}>Get hands-on experience</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.light.tint} />
                            <Text style={styles.bulletText}>Learn from industry experts</Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.viewContentButton}
                        onPress={() => router.push(`/screen/courses/content?id=${course.id}` as any)}
                    >
                        <Ionicons name="book-outline" size={24} color={Colors.light.tint} />
                        <Text style={styles.viewContentText}>View Course Content</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.tint} />
                    </TouchableOpacity>

                    {enrolled && (
                        <View style={styles.enrolledBadge}>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                            <Text style={styles.enrolledText}>You are enrolled in this course</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <View>
                        <Text style={styles.footerLabel}>Total Price</Text>
                        <Text style={styles.footerPrice}>${course.price}</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.enrollButton,
                            (enrolling || enrolled) && styles.enrollButtonDisabled
                        ]}
                        onPress={handleEnroll}
                        disabled={enrolling || enrolled}
                    >
                        {enrolling ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name={enrolled ? "checkmark" : "add-circle-outline"} size={20} color="#fff" />
                                <Text style={styles.enrollButtonText}>
                                    {enrolled ? 'Enrolled' : 'Enroll Now'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#11181C',
        marginTop: 16,
        marginBottom: 24,
    },
    imageContainer: {
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 300,
        backgroundColor: '#E5E7EB',
    },
    backIconButton: {
        position: 'absolute',
        top: 48,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookmarkIconButton: {
        position: 'absolute',
        top: 48,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    instructorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructorAvatarLarge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
        marginRight: 16,
    },
    instructorDetails: {
        flex: 1,
    },
    instructorLabel: {
        fontSize: 12,
        color: '#687076',
        marginBottom: 4,
    },
    instructorNameLarge: {
        fontSize: 16,
        fontWeight: '600',
        color: '#11181C',
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 16,
        lineHeight: 32,
    },
    metaContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    metaText: {
        fontSize: 14,
        color: '#687076',
        marginLeft: 8,
    },
    priceContainer: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    priceLabel: {
        fontSize: 14,
        color: '#687076',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.tint,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#687076',
        lineHeight: 24,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bulletText: {
        fontSize: 14,
        color: '#687076',
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    enrolledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    enrolledText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
        marginLeft: 12,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    footerLabel: {
        fontSize: 12,
        color: '#687076',
        marginBottom: 4,
    },
    footerPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#11181C',
    },
    enrollButton: {
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    enrollButtonDisabled: {
        opacity: 0.6,
    },
    enrollButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    viewContentButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: Colors.light.tint,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    viewContentText: {
        color: Colors.light.tint,
        fontSize: 16,
        fontWeight: '600',
    },
})
