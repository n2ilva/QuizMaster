import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { QuizActionButton } from '@/components/quiz/action-button';
import { getCategoryDocumentation } from '@/data/documentation';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useLogout } from '@/hooks/use-logout';
import { buildStudyRoute, parseStudyIndex, parseStudySequence } from '@/lib/study-flow';

import { FormattedContent } from './components/formatted-content';

export function ThemeInfoScreen() {
  const router = useRouter();
  const { track, category, sequence, index, source } = useLocalSearchParams<{
    track: string;
    category: string;
    sequence?: string | string[];
    index?: string | string[];
    source?: string;
  }>();
  const layoutMode = useLayoutMode();
  const isDesktopLayout = layoutMode === 'desktop';
  const { handleLogout } = useLogout();

  const decodedTrack = useMemo(() => decodeURIComponent(track ?? ''), [track]);
  const decodedCategory = useMemo(() => decodeURIComponent(category ?? ''), [category]);
  const planSequence = useMemo(() => parseStudySequence(sequence), [sequence]);
  const planIndex = useMemo(() => parseStudyIndex(index), [index]);

  const doc = useMemo(() => getCategoryDocumentation(decodedTrack, decodedCategory), [decodedTrack, decodedCategory]);
  const studyHref = useMemo(
    () =>
      buildStudyRoute({
        track: decodedTrack,
        category: decodedCategory,
        sequence: planSequence,
        index: planIndex ?? undefined,
      }),
    [decodedCategory, decodedTrack, planIndex, planSequence],
  );
  const isPlanFlow = source === 'plan' && planSequence.length > 0;

  const handleStartQuiz = () => {
    if (isPlanFlow) {
      router.replace(studyHref as never);
      return;
    }

    router.push(studyHref as never);
  };

  const backButton = (
    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, alignSelf: 'flex-start' }}>
      <MaterialIcons name="arrow-back" size={18} color="#64748B" />
      <Text style={{ color: '#64748B', fontSize: 14 }}>Voltar para Categorias</Text>
    </Pressable>
  );

  const content = (
    <>
      {doc ? (
        <>
          <View style={{ backgroundColor: '#111827', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#1F2937' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <View style={{ backgroundColor: '#312E81', padding: 12, borderRadius: 14 }}>
                <MaterialIcons name="terminal" size={24} color="#A5B4FC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>{doc.title}</Text>
                <Text style={{ color: '#64748B', fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {decodedTrack} • Referência
                </Text>
              </View>
            </View>
            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 22, marginTop: 8 }}>{doc.introduction}</Text>
          </View>

          {doc.sections.map((section, index) => (
            <View key={index} style={{ backgroundColor: '#111827', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#1F2937' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1F2937' }}>
                <View style={{ backgroundColor: '#1E3A5F', width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#60A5FA', fontSize: 14, fontWeight: '700' }}>{index + 1}</Text>
                </View>
                <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '600', flex: 1 }}>{section.heading.replace(/^📖\s*/, '')}</Text>
              </View>
              <FormattedContent content={section.content} />
            </View>
          ))}

          <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 20, marginTop: 8, borderWidth: 1, borderColor: '#1F2937' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={{ backgroundColor: '#713F12', padding: 8, borderRadius: 8 }}>
                <MaterialIcons name="auto-awesome" size={16} color="#FCD34D" />
              </View>
              <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '600' }}>Comandos Essenciais</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {doc.keyTopics.map((topic, index) => (
                <View key={index} style={{ backgroundColor: '#1E293B', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#334155' }}>
                  <Text style={{ color: '#E2E8F0', fontSize: 12, fontWeight: '500', fontFamily: 'monospace' }}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: '#1F2937' }}>
            <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>Próximo passo</Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 16 }}>
              Depois da leitura, pratique com os quizzes desta categoria para fixar o conteúdo antes de seguir para o próximo tópico.
            </Text>
            <QuizActionButton
              label="Começar quizzes desta categoria"
              icon="quiz"
              trailingIcon="arrow-forward"
              onPress={handleStartQuiz}
              variant="primary-solid"
              fullWidth
            />
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <View style={{ backgroundColor: '#1F2937', padding: 20, borderRadius: 20 }}>
            <MaterialIcons name="construction" size={48} color="#6B7280" />
          </View>
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '600', marginTop: 16 }}>Documentação em breve</Text>
          <Text style={{ color: '#64748B', fontSize: 14, marginTop: 8, textAlign: 'center' }}>{`A documentação para "${decodedCategory}" está sendo preparada.`}</Text>
          <View style={{ width: '100%', maxWidth: 420, marginTop: 24 }}>
            <QuizActionButton
              label="Ir para os quizzes desta categoria"
              icon="quiz"
              trailingIcon="arrow-forward"
              onPress={handleStartQuiz}
              variant="primary-solid"
              fullWidth
            />
          </View>
        </View>
      )}
    </>
  );

  if (isDesktopLayout) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0D0F10' }}>
        <DesktopSidebar onLogout={() => void handleLogout()} />
        <ScrollView
          style={{ flex: 1, backgroundColor: '#111316' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 32, paddingTop: 32, paddingBottom: 100 }}>
          {backButton}
          <View style={{ width: '100%', maxWidth: 1040, alignSelf: 'center' }}>{content}</View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0A0C0E' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 100 }}>
      {backButton}
      {content}
    </ScrollView>
  );
}
