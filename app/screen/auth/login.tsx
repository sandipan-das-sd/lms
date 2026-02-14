import { AuthContext } from '@/app/context/authContext'
import { Colors } from '@/constants/theme'
import Entypo from '@expo/vector-icons/Entypo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Login() {  
    const { login } = React.useContext(AuthContext)!
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({ username: '', password: '' })

    const validateForm = () => {
        let isValid = true
        const newErrors = { username: '', password: '' }

        if (!username.trim()) {
            newErrors.username = 'Username is required'
            isValid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            await login({ username: username.trim(), password })
            router.replace('/(tabs)')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
            Alert.alert('Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = () => {
        router.push('/screen/auth/register')
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
                        Welcome Back 
                    </Text>
                    <Entypo name="hand" size={32} color={Colors.light.tint} style={styles.handIcon} />
                </View>

                <Text style={styles.subtitle}>
                    Sign in to continue your learning journey
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

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.registerLink}>Sign Up</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#11181C',
    },
    handIcon: {
        marginLeft: 8,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#0a7ea4',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#0a7ea4',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
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
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: '#687076',
        fontSize: 14,
    },
    registerLink: {
        color: '#0a7ea4',
        fontSize: 14,
        fontWeight: '600',
    },
})
