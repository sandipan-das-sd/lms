import { SERVER_URL } from "@/services/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { createContext, ReactNode, useEffect, useState } from "react"
import { AuthContext } from "./authContext"
interface Instructor {
    cell: string
    dob: {
        age: number
        date: string
    }
    email: string
    gender: string
    id: number
    location: {
        city: string
        coordinates: {
            latitude: string
            longitude: string
        }
        country: string
        postcode: number | string
        state: string
        street: {
            name: string
            number: number
        }
        timezone: {
            description: string
            offset: string
        }
    }
    login: {
        md5: string
        password: string
        salt: string
        sha1: string
        sha256: string
        username: string
        uuid: string
    }
    name: {
        first: string
        last: string
        title: string
    }
    nat: string
    phone: string
    picture: {
        large: string
        medium: string
        thumbnail: string
    }
    registered: {
        age: number
        date: string
    }
}

interface Product {
    _id: string
    brand: string
    category: string
    description: string
    mainImage: {
        _id: string
        localPath: string
        url: string
    }
    name: string
    owner: string
    price: number
    stock: number
    subImages: {
        _id: string
        localPath: string
        url: string
    }[]
    createdAt: string
    updatedAt: string
    __v: number
}

interface Course {
    id: string
    title: string
    description: string
    price: number
    thumbnail: string
    instructor: {
        name: string
        avatar: string
    }
    category: string
    stock: number
}

interface CourseContextType {
    courses: Course[]
    instructors: Instructor[]
    loading: boolean
    refreshing: boolean
    bookmarkedCourses: string[]
    enrolledCourses: string[]
    searchQuery: string
    filteredCourses: Course[]
    fetchCourses: () => Promise<void>
    refreshCourses: () => Promise<void>
    toggleBookmark: (courseId: string) => Promise<void>
    enrollCourse: (courseId: string) => Promise<void>
    isBookmarked: (courseId: string) => boolean
    isEnrolled: (courseId: string) => boolean
    setSearchQuery: (query: string) => void
    getCourseById: (courseId: string) => Course | undefined
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined)

interface CourseProviderProps {
    children: ReactNode
}

export const CourseProvider = ({ children }: CourseProviderProps) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [instructors, setInstructors] = useState<Instructor[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([])
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadBookmarks()
        loadEnrolledCourses()
        fetchCourses()
    }, [])

    const loadBookmarks = async () => {
        try {
            const stored = await AsyncStorage.getItem('bookmarkedCourses')
            if (stored) {
                setBookmarkedCourses(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error)
        }
    }

    const loadEnrolledCourses = async () => {
        try {
            const stored = await AsyncStorage.getItem('enrolledCourses')
            if (stored) {
                setEnrolledCourses(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Error loading enrolled courses:', error)
        }
    }

    const fetchInstructors = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/public/randomusers`)
            if (response.data.success && response.data.data) {
                return response.data.data.data || []
            }
            return []
        } catch (error) {
            console.error('Error fetching instructors:', error)
            return []
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/public/randomproducts`)
            if (response.data.success && response.data.data) {
                return response.data.data.data || []
            }
            return []
        } catch (error) {
            console.error('Error fetching products:', error)
            return []
        }
    }

    const mapProductsToCourses = (products: Product[], instructors: Instructor[]): Course[] => {
        return products.map((product, index) => {
            const instructor = instructors[index % instructors.length]
            return {
                id: product._id,
                title: product.name,
                description: product.description,
                price: product.price,
                thumbnail: product.mainImage?.url || '',
                instructor: {
                    name: instructor ? `${instructor.name.first} ${instructor.name.last}` : 'Unknown Instructor',
                    avatar: instructor?.picture?.medium || ''
                },
                category: product.category,
                stock: product.stock
            }
        })
    }

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const [instructorsData, productsData] = await Promise.all([
                fetchInstructors(),
                fetchProducts()
            ])
            
            setInstructors(instructorsData)
            const mappedCourses = mapProductsToCourses(productsData, instructorsData)
            setCourses(mappedCourses)
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshCourses = async () => {
        setRefreshing(true)
        try {
            const [instructorsData, productsData] = await Promise.all([
                fetchInstructors(),
                fetchProducts()
            ])
            
            setInstructors(instructorsData)
            const mappedCourses = mapProductsToCourses(productsData, instructorsData)
            setCourses(mappedCourses)
        } catch (error) {
            console.error('Error refreshing courses:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const toggleBookmark = async (courseId: string) => {
        try {
            let updated: string[]
            if (bookmarkedCourses.includes(courseId)) {
                updated = bookmarkedCourses.filter(id => id !== courseId)
            } else {
                updated = [...bookmarkedCourses, courseId]
            }
            setBookmarkedCourses(updated)
            await AsyncStorage.setItem('bookmarkedCourses', JSON.stringify(updated))
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    const enrollCourse = async (courseId: string) => {
        try {
            if (!enrolledCourses.includes(courseId)) {
                const updated = [...enrolledCourses, courseId]
                setEnrolledCourses(updated)
                await AsyncStorage.setItem('enrolledCourses', JSON.stringify(updated))
            }
        } catch (error) {
            console.error('Error enrolling course:', error)
            throw error
        }
    }

    const isBookmarked = (courseId: string) => {
        return bookmarkedCourses.includes(courseId)
    }

    const isEnrolled = (courseId: string) => {
        return enrolledCourses.includes(courseId)
    }

    const getCourseById = (courseId: string) => {
        return courses.find(course => course.id === courseId)
    }

    const filteredCourses = courses.filter(course => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.instructor.name.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query)
        )
    })

    return (
        <CourseContext.Provider
            value={{
                courses,
                instructors,
                loading,
                refreshing,
                bookmarkedCourses,
                enrolledCourses,
                searchQuery,
                filteredCourses,
                fetchCourses,
                refreshCourses,
                toggleBookmark,
                enrollCourse,
                isBookmarked,
                isEnrolled,
                setSearchQuery,
                getCourseById
            }}
        >
            {children}
        </CourseContext.Provider>
    )
}
