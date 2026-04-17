import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { PanelCard } from '@/components/quiz/panel-card';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';

export function PracticeHubScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const layoutMode = useLayoutMode();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navigateToCodingPractice = () => {
    router.push('/coding-practice');
  };

  const navigateToQuiz = () => {
    router.push('/quiz');
  };

  const HubContent = () => (
    <>
      <View style={{ marginBottom: 32, paddingHorizontal: layoutMode === 'desktop' ? 0 : 4, marginTop: 24 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: isDark ? '#ECEDEE' : '#11181C', marginBottom: 8, letterSpacing: -0.5 }}>
          Praticar
        </Text>
        <Text style={{ fontSize: 15, color: isDark ? '#9BA1A6' : '#687076', lineHeight: 22 }}>
          Escolha como você deseja testar seus conhecimentos e avance na sua jornada de aprendizado.
        </Text>
      </View>

      <View style={{ gap: 20 }}>
        {/* Quebra-Cabeça Card */}
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToCodingPractice}>
          <PanelCard compact={false} style={{
            backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
            borderColor: isDark ? 'rgba(63,81,181,0.2)' : 'rgba(63,81,181,0.1)',
            borderWidth: 1,
            borderRadius: 24,
            padding: 24,
            shadowColor: '#3F51B5',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
              <View style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20, 
                backgroundColor: 'rgba(63,81,181,0.15)', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(63,81,181,0.3)',
              }}>
                <MaterialIcons name="extension" size={32} color="#3F51B5" />
              </View>
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#ECEDEE' : '#11181C', marginBottom: 6, letterSpacing: -0.5 }}>
                  Prática de Código
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 22, color: isDark ? '#9BA1A6' : '#687076' }}>
                  Monte códigos como quebra-cabeças.
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <MaterialIcons name="arrow-forward" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
              </View>
            </View>
          </PanelCard>
        </TouchableOpacity>

        {/* Quiz Card */}
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToQuiz}>
          <PanelCard compact={false} style={{
            backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
            borderColor: isDark ? 'rgba(14,165,233,0.2)' : 'rgba(14,165,233,0.1)',
            borderWidth: 1,
            borderRadius: 24,
            padding: 24,
            shadowColor: '#0EA5E9',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
              <View style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20, 
                backgroundColor: 'rgba(14,165,233,0.12)', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(14,165,233,0.25)',
              }}>
                <MaterialIcons name="quiz" size={32} color="#0EA5E9" />
              </View>
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#ECEDEE' : '#11181C', marginBottom: 6, letterSpacing: -0.5 }}>
                  Quiz
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 22, color: isDark ? '#9BA1A6' : '#687076' }}>
                  Se desafie respondendo questões desafiadoras.
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <MaterialIcons name="arrow-forward" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
              </View>
            </View>
          </PanelCard>
        </TouchableOpacity>

        {/* Apaga o Incidente (Quick Response) Card */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/quick-response')}>
          <PanelCard compact={false} style={{
            backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
            borderColor: isDark ? 'rgba(244,63,94,0.2)' : 'rgba(244,63,94,0.1)',
            borderWidth: 1,
            borderRadius: 24,
            padding: 24,
            shadowColor: '#F43F5E',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
              <View style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20, 
                backgroundColor: 'rgba(244,63,94,0.12)', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(244,63,94,0.25)',
              }}>
                <MaterialIcons name="fire-extinguisher" size={32} color="#F43F5E" />
              </View>
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#ECEDEE' : '#11181C', marginBottom: 6, letterSpacing: -0.5 }}>
                  Gestão de Incidentes
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 22, color: isDark ? '#9BA1A6' : '#687076' }}>
                  Resposta rápida para incidentes de suporte e segurança.
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <MaterialIcons name="arrow-forward" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
              </View>
            </View>
          </PanelCard>
        </TouchableOpacity>

        {/* DataCenter Builder Card */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/datacenter-builder')}>
          <PanelCard compact={false} style={{
            backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
            borderColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
            borderWidth: 1,
            borderRadius: 24,
            padding: 24,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
              <View style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20, 
                backgroundColor: 'rgba(16,185,129,0.12)', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(16,185,129,0.25)',
              }}>
                <MaterialIcons name="dns" size={32} color="#10B981" />
              </View>
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#ECEDEE' : '#11181C', marginBottom: 6, letterSpacing: -0.5 }}>
                  DataCenter Builder
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 22, color: isDark ? '#9BA1A6' : '#687076' }}>
                  Simule a montagem e conexão de um rack real.
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <MaterialIcons name="arrow-forward" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
              </View>
            </View>
          </PanelCard>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#111316' : '#F8FAFC' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: bottomPadding + 32,
        paddingHorizontal: layoutMode === 'desktop' ? 32 : 20,
      }}>
      
      {layoutMode === 'desktop' ? (
        <View style={{ width: '100%', maxWidth: 880, alignSelf: 'center', paddingTop: 16 }}>
          <HubContent />
        </View>
      ) : (
        <HubContent />
      )}
    </ScrollView>
  );
}
