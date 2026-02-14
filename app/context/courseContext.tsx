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
            console.log('Products API response:', response.data)
            if (response.data.success && response.data.data) {
                const products = response.data.data.data || []
                if (products.length > 0) {
                    console.log('First product sample:', JSON.stringify(products[0], null, 2))
                }
                return products
            }
            return []
        } catch (error) {
            console.error('Error fetching products:', error)
            return []
        }
    }

    const mapProductsToCourses = (products: Product[], instructors: Instructor[]): Course[] => {
        console.log('mapProductsToCourses - Products count:', products.length)
        console.log('mapProductsToCourses - Instructors count:', instructors.length)
        
        if (products.length === 0) {
            console.log('No products to map!')
            return []
        }
        
        const mapped = products
            .map((product, index) => {
                console.log(`Mapping product ${index}:`, product._id, product.name)
                const instructor = instructors[index % instructors.length]
                return {
                    id: product._id || `product-${index}`,
                    title: product.name || 'Untitled Course',
                    description: product.description || 'No description available',
                    price: product.price || 0,
                    thumbnail: product.mainImage?.url || '',
                    instructor: {
                        name: instructor ? `${instructor.name.first} ${instructor.name.last}` : 'Unknown Instructor',
                        avatar: instructor?.picture?.medium || ''
                    },
                    category: product.category || 'General',
                    stock: product.stock || 0
                }
            })
        
        console.log('Mapped courses result:', mapped.length)
        return mapped
    }

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const [instructorsData, productsData] = await Promise.all([
                fetchInstructors(),
                fetchProducts()
            ])
            
            console.log('Fetched instructors:', instructorsData.length)
            console.log('Fetched products:', productsData.length)
            
            setInstructors(instructorsData)
            const mappedCourses = mapProductsToCourses(productsData, instructorsData)
            console.log('Mapped courses:', mappedCourses.length)
            if (mappedCourses.length > 0) {
                console.log('First course ID:', mappedCourses[0].id)
                console.log('First course title:', mappedCourses[0].title)
            }
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
        console.log('Looking for course with ID:', courseId)
        console.log('Available courses:', courses.length)
        const found = courses.find(course => course.id === courseId)
        console.log('Found course:', found ? found.title : 'NOT FOUND')
        return found
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
