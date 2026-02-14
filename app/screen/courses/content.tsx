import React, { useRef, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CourseContext } from '@/app/context/courseContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/theme'

export default function CourseContentViewer() {
    const params = useLocalSearchParams()
    const id = params.id as string
    const router = useRouter()
    const context = useContext(CourseContext)
    const webViewRef = useRef<WebView>(null)

    if (!context) {
        return null
    }

    const { getCourseById, enrollCourse } = context
    const course = getCourseById(id)

    const handleMessage = async (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data)
            
            if (data.type === 'ENROLL_COURSE') {
                try {
                    await enrollCourse(data.courseId)
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
                    Alert.alert('Error', 'Failed to enroll in course')
                }
            }
        } catch (error) {
            console.error('Error handling message from WebView:', error)
        }
    }

    const sendDataToWebView = () => {
        if (webViewRef.current && course) {
            const courseData = JSON.stringify({
                id: course.id,
                title: course.title,
                description: course.description,
                price: course.price,
                category: course.category,
                instructor: {
                    name: course.instructor.name,
                    avatar: course.instructor.avatar
                }
            })
            
            webViewRef.current.postMessage(courseData)
        }
    }

    const htmlSource = require('@/assets/course-content.html')

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            
            <WebView
                ref={webViewRef}
                source={htmlSource}
                style={styles.webview}
                onMessage={handleMessage}
                onLoadEnd={sendDataToWebView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    header: {
        paddingTop: 48,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
})
