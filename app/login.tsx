import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

type ScreenMode = 'login' | 'register' | 'forgot';
type MessageType = 'success' | 'error' | null;

export default function LoginScreen() {
  const { login, register, resetPassword, isLoading, user } = useAuth();

  const [mode, setMode] = useState<ScreenMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [isLoading, user]);

  function switchMode(next: ScreenMode) {
    setMode(next);
    setMessage(null);
    setMessageType(null);
    setName('');
    setPassword('');
    setNewPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
  }

  async function onLogin() {
    try {
      setSubmitting(true);
      setMessage(null);
      setMessageType(null);
      await login(email, password);
      router.replace('/(tabs)');
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
      router.replace('/(tabs)');
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
      ? 'Entrar no QuizMaster'
      : mode === 'register'
        ? 'Criar conta'
        : 'Redefinir senha';

  const subtitle =
    mode === 'login'
      ? 'Entre para sincronizar progresso, recompensas e quizzes personalizados.'
      : mode === 'register'
        ? 'Crie sua conta para começar a estudar.'
        : 'Informe seu email cadastrado para receber o link de redefinição.';

  return (
    <View className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]">
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">{title}</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">{subtitle}</Text>

      <View className="mt-6 gap-3">
        {mode === 'register' && (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#8D98A5"
            className="rounded-xl border border-[#E6E8EB] px-4 py-3 text-[#11181C] dark:border-[#30363D] dark:text-[#ECEDEE]"
          />
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          placeholderTextColor="#8D98A5"
          className="rounded-xl border border-[#E6E8EB] px-4 py-3 text-[#11181C] dark:border-[#30363D] dark:text-[#ECEDEE]"
        />

        {mode !== 'forgot' && (
          <View className="relative">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor="#8D98A5"
              secureTextEntry={!showPassword}
              className="rounded-xl border border-[#E6E8EB] px-4 py-3 pr-16 text-[#11181C] dark:border-[#30363D] dark:text-[#ECEDEE]"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-0 bottom-0 justify-center">
              <Text className="text-sm font-semibold text-[#3F51B5]">
                {showPassword ? 'Ocultar' : 'Ver'}
              </Text>
            </Pressable>
          </View>
        )}


      </View>

      {mode === 'login' && (
        <Pressable onPress={() => switchMode('forgot')} className="mt-3 self-end">
          <Text className="text-sm text-[#3F51B5]">Esqueceu a senha?</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          if (submitting || isLoading) return;
          if (mode === 'login') void onLogin();
          else if (mode === 'register') void onRegister();
          else void onResetPassword();
        }}
        className="mt-5 rounded-xl bg-[#3F51B5] px-4 py-3">
        <Text className="text-center font-semibold text-white">
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
        className="mt-3 rounded-xl border border-[#3F51B5] px-4 py-3">
        <Text className="text-center font-semibold text-[#3F51B5]">
          {mode === 'login' ? 'Criar conta' : 'Já tenho conta'}
        </Text>
      </Pressable>

      {message ? (
        <Text
          className={`mt-3 text-center text-sm ${
            messageType === 'success'
              ? 'text-[#22C55E]'
              : messageType === 'error'
                ? 'text-[#DC2626]'
                : 'text-[#687076] dark:text-[#9BA1A6]'
          }`}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
