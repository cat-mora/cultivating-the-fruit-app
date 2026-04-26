import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmail } from '@/lib/auth/auth-service';

/**
 * Sign In Page
 *
 * Email/password authentication for web users
 * Uses Expo Router and React Native components
 */
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert(
        'Sign In Failed',
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo-full.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Grow your spiritual life, one day at a time</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your spiritual journey</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(web)/auth/sign-up" asChild>
              <Pressable>
                <Text style={styles.link}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#6B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 280,
    height: 80,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#8B6F47',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B2D3E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B6F47',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B2D3E',
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#F5EDE0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    outlineStyle: 'none',
  },
  button: {
    width: '100%',
    padding: 14,
    backgroundColor: '#6B2D3E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A67C89',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#8B6F47',
  },
  link: {
    fontSize: 14,
    color: '#6B2D3E',
    fontWeight: '600',
    textDecorationLine: 'none',
  },
});
