import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { AuthContext, AuthProvider } from './context/authContext'
import { CourseProvider } from './context/courseContext'
import { useContext, useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

export const unstable_settings = {
  initialRouteName: 'screen/auth/login',
}

function RootNavigator() {
  const colorScheme = useColorScheme()
  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { userToken, loading } = authContext

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    )
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="screen/courses/[id]" />
            <Stack.Screen name="screen/courses/content" />
          </>
        ) : (
          <>
            <Stack.Screen name="screen/auth/login" />
            <Stack.Screen name="screen/auth/register" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CourseProvider>
        <RootNavigator />
      </CourseProvider>
    </AuthProvider>
  )
}
