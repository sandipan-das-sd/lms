import { AuthContext } from '@/app/context/authContext'
import { Colors } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Register() {
    const { register } = React.useContext(AuthContext)!
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('user')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    })

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = { username: '', email: '', password: '', confirmPassword: '' }

        if (!username.trim()) {
            newErrors.username = 'Username is required'
            isValid = false
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
            isValid = false
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email'
            isValid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
            isValid = false
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleRegister = async () => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            await register({ 
                username: username.trim(), 
                email: email.trim(), 
                password,
                role 
            })
            Alert.alert('Success', 'Registration successful! Please login.')
            router.replace('/screen/auth/login')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
            Alert.alert('Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = () => {
        router.push('/screen/auth/login')
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        Create Account
                    </Text>
                </View>

                <Text style={styles.subtitle}>
                    Join us to start your learning journey
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                            <TextInput 
                                placeholder="Username"
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text)
                                    setErrors(prev => ({ ...prev, username: '' }))
                                }}
                                style={styles.input}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>
                        {errors.username ? (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                            <TextInput 
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text)
                                    setErrors(prev => ({ ...prev, email: '' }))
                                }}
                                style={styles.input}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>
                        {errors.email ? (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                            <TextInput 
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                    setErrors(prev => ({ ...prev, password: '' }))
                                }}
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons 
                                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color={Colors.light.icon} 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.light.icon} style={styles.inputIcon} />
                            <TextInput 
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text)
                                    setErrors(prev => ({ ...prev, confirmPassword: '' }))
                                }}
                                style={styles.input}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color={Colors.light.icon} 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword ? (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        ) : null}
                    </View>

                    <View style={styles.roleContainer}>
                        <Text style={styles.roleLabel}>Select Role</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity 
                                style={[styles.roleButton, role === 'user' && styles.roleButtonActive]}
                                onPress={() => setRole('user')}
                                disabled={loading}
                            >
                                <Ionicons 
                                    name="person" 
                                    size={20} 
                                    color={role === 'user' ? '#fff' : Colors.light.icon} 
                                />
                                <Text style={[styles.roleButtonText, role === 'user' && styles.roleButtonTextActive]}>
                                    Student
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.roleButton, role === 'teacher' && styles.roleButtonActive]}
                                onPress={() => setRole('teacher')}
                                disabled={loading}
                            >
                                <Ionicons 
                                    name="school" 
                                    size={20} 
                                    color={role === 'teacher' ? '#fff' : Colors.light.icon} 
                                />
                                <Text style={[styles.roleButtonText, role === 'teacher' && styles.roleButtonTextActive]}>
                                    Teacher
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#11181C',
    },
    subtitle: {
        fontSize: 16,
        color: '#687076',
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#11181C',
    },
    eyeIcon: {
        padding: 8,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    roleContainer: {
        marginBottom: 24,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#11181C',
        marginBottom: 12,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        gap: 8,
    },
    roleButtonActive: {
        backgroundColor: '#0a7ea4',
        borderColor: '#0a7ea4',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#687076',
    },
    roleButtonTextActive: {
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#0a7ea4',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#687076',
        fontSize: 14,
    },
    loginLink: {
        color: '#0a7ea4',
        fontSize: 14,
        fontWeight: '600',
    },
})
