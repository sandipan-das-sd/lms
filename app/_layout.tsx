import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { AuthProvider } from './context/authContext'
import { CourseProvider } from './context/courseContext'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <CourseProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="screen/courses/[id]" />
            <Stack.Screen name="screen/auth/login" />
            <Stack.Screen name="screen/auth/register" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CourseProvider>
    </AuthProvider>
  )
}
