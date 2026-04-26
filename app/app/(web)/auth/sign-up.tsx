import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signUpWithEmail } from '@/lib/auth/auth-service';
import { validateSignupInvite, markInviteAsUsed } from '@/lib/admin/admin-service';

/**
 * Sign Up Page
 *
 * Email/password registration for web users
 * Uses Expo Router and React Native components
 */
export default function SignUp() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!inviteCode || inviteCode.trim().length !== 6) {
      setError('Please enter a valid 6-character invite code');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Validate invite code
      const invite = await validateSignupInvite(inviteCode.trim());

      if (!invite) {
        setError('Invalid, expired, or already used invite code');
        setIsLoading(false);
        return;
      }

      // Create account
      const user = await signUpWithEmail(email, password);

      if (!user) {
        setError('Failed to create account');
        setIsLoading(false);
        return;
      }

      // Mark invite as used
      const marked = await markInviteAsUsed(inviteCode.trim(), user.id);

      if (!marked) {
        console.error('Failed to mark invite as used, but account was created');
      }

      // Success - redirect to onboarding
      router.replace('/onboarding');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to create account. Please try again.';
      setError(errorMessage);
      console.error('Sign up error:', err);
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

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Begin your journey of cultivating spiritual fruits</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Invite Code</Text>
            <TextInput
              style={[styles.input, styles.inviteInput]}
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              autoCapitalize="characters"
              editable={!isLoading}
            />
            <Text style={styles.helperText}>Enter the 6-character code provided by an admin</Text>
          </View>

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
              autoComplete="password-new"
              editable={!isLoading}
            />
            <Text style={styles.helperText}>At least 8 characters</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
          </View>

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(web)/auth/sign-in" asChild>
              <Pressable>
                <Text style={styles.link}>Sign In</Text>
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
  inviteInput: {
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  helperText: {
    fontSize: 12,
    color: '#8B6F47',
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    textAlign: 'center',
  },
});
