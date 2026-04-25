import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

type ScreenMode = 'login' | 'register' | 'forgot';
type MessageType = 'success' | 'error' | null;

export default function LoginScreen() {
  const { login, register, resetPassword, isLoading, user } = useAuth();

  const [mode, setMode] = useState<ScreenMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(features)/(main)');
    }
  }, [isLoading, user]);

  function switchMode(next: ScreenMode) {
    setMode(next);
    setMessage(null);
    setMessageType(null);
    setName('');
    setPassword('');
    setShowPassword(false);
  }

  async function onLogin() {
    try {
      setSubmitting(true);
      setMessage(null);
      setMessageType(null);
      await login(email, password);
      router.replace('/(features)/(main)');
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao realizar login.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegister() {
    if (!name.trim()) {
      setMessageType('error');
      setMessage('Informe seu nome.');
      return;
    }
    try {
      setSubmitting(true);
      setMessage(null);
      setMessageType(null);
      await register(name, email, password);
      router.replace('/(features)/(main)');
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao criar conta.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onResetPassword() {
    if (!email.trim()) {
      setMessageType('error');
      setMessage('Informe o email cadastrado.');
      return;
    }
    try {
      setSubmitting(true);
      setMessage(null);
      setMessageType(null);
      await resetPassword(email);
      switchMode('login');
      setEmail(email);
      setMessageType('success');
      setMessage('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao enviar email de redefinição.');
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    mode === 'login'
      ? 'Entrar no QMaster'
      : mode === 'register'
        ? 'Criar conta'
        : 'Redefinir senha';

  const subtitle =
    mode === 'login'
      ? 'Entre para sincronizar seu progresso e acessar todos os simuladores e desafios.'
      : mode === 'register'
        ? 'Crie sua conta para começar a estudar.'
        : 'Informe seu email cadastrado para receber o link de redefinição.';

  return (
    <View style={styles.container}>
      <View style={styles.formWrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.fieldsWrap}>
        {mode === 'register' && (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#8D98A5"
            style={styles.input}
          />
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          placeholderTextColor="#8D98A5"
          style={styles.input}
        />

        {mode !== 'forgot' && (
          <View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor="#8D98A5"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 64 }]}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordBtn}>
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </Text>
            </Pressable>
          </View>
        )}


      </View>

      {mode === 'login' && (
        <Pressable onPress={() => switchMode('forgot')} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          if (submitting || isLoading) return;
          if (mode === 'login') void onLogin();
          else if (mode === 'register') void onRegister();
          else void onResetPassword();
        }}
        style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>
          {submitting
            ? 'Processando...'
            : mode === 'login'
              ? 'Entrar'
              : mode === 'register'
                ? 'Criar conta'
                : 'Enviar link de redefinição'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          if (mode === 'login') switchMode('register');
          else switchMode('login');
        }}
        style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>
          {mode === 'login' ? 'Criar conta' : 'Já tenho conta'}
        </Text>
      </Pressable>

      {message ? (
        <Text
          style={[
            styles.messageText,
            messageType === 'success'
              ? { color: '#22C55E' }
              : messageType === 'error'
                ? { color: '#DC2626' }
                : { color: '#9BA1A6' },
          ]}>
          {message}
        </Text>
      ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151718',
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  formWrap: {
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ECEDEE',
  },
  subtitle: {
    marginTop: 8,
    color: '#9BA1A6',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldsWrap: {
    marginTop: 24,
    gap: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ECEDEE',
    fontSize: 15,
  },
  showPasswordBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  showPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F51B5',
  },
  forgotBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    color: '#3F51B5',
  },
  primaryBtn: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#3F51B5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryBtnText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 15,
  },
  secondaryBtn: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F51B5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  secondaryBtnText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#3F51B5',
    fontSize: 15,
  },
  messageText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});
