/**
 * Reset Password Web Handler
 * Handles the web route /reset-password and redirects to the app
 */

import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

export default function ResetPasswordWeb() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    console.log('🔑 [WEB RESET] Reset password web handler mounted');
    console.log('🔑 [WEB RESET] Search params:', searchParams);
    
    const handleRedirect = () => {
      try {
        // Check if we have hash params in the URL (Supabase puts tokens in hash)
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          console.log('🔑 [WEB RESET] Full URL:', url.href);
          
          // Extract hash fragment parameters
          const hash = url.hash.substring(1); // Remove #
          const params = {};
          
          if (hash) {
            console.log('🔑 [WEB RESET] Hash fragment:', hash);
            const hashParams = new URLSearchParams(hash);
            hashParams.forEach((value, key) => {
              params[key] = value;
              console.log(`🔑 [WEB RESET] Hash param: ${key}=${value}`);
            });
          }
          
          // Also check query params
          searchParams.forEach((value, key) => {
            if (!params[key]) {
              params[key] = value;
              console.log(`🔑 [WEB RESET] Query param: ${key}=${value}`);
            }
          });
          
          console.log('🔑 [WEB RESET] Redirecting to update-password with params:', params);
          router.replace({ pathname: '/update-password', params });
        } else {
          console.log('🔑 [WEB RESET] No window object, redirecting without params');
          router.replace('/update-password');
        }
      } catch (error) {
        console.error('🔑 [WEB RESET] Error extracting params:', error);
        console.log('🔑 [WEB RESET] Redirecting to update-password without params');
        router.replace('/update-password');
      }
    };
    
    // Redirect to the update password screen
    const timer = setTimeout(handleRedirect, 100);
    
    return () => clearTimeout(timer);
  }, [router, searchParams]);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={{ marginTop: 16, color: '#666' }}>Loading password reset...</Text>
    </View>
  );
}
