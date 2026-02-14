import { AuthContext } from '@/app/context/authContext'
import { Colors } from '@/constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useContext } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Profile() {
    const authContext = useContext(AuthContext)
    const router = useRouter()

    if (!authContext) {
        return null
    }

    const { user, logout } = authContext

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout()
                        router.replace('/screen/auth/login')
                    }
                }
            ]
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    {user?.avatar?.url ? (
                        <Image
                            source={{ uri: user.avatar.url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={48} color={Colors.light.icon} />
                        </View>
                    )}
                    <Text style={styles.username}>{user?.username || 'Guest User'}</Text>
                    <Text style={styles.email}>{user?.email || 'Not logged in'}</Text>
                    {user?.role && (
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user.role}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="person-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="lock-closed-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="notifications-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Learning</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="school-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>My Courses</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="trophy-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Achievements</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="download-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Downloads</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="help-circle-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>Help Center</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="information-circle-outline" size={24} color={Colors.light.icon} />
                            <Text style={styles.menuItemText}>About</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    profileSection: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#11181C',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#687076',
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.tint,
        textTransform: 'capitalize',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#11181C',
        marginBottom: 12,
    },
    menuItem: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#11181C',
        marginLeft: 12,
    },
    logoutButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginTop: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
        marginLeft: 8,
    },
})
