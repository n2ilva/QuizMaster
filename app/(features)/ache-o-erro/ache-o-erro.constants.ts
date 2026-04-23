import { Level, LanguageInfo } from './ache-o-erro.types';

export const DEBUG_LANGUAGES: LanguageInfo[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'language-javascript',
    color: '#F7DF1E',
  },
  {
    id: 'python',
    label: 'Python',
    icon: 'language-python',
    color: '#3776AB',
  },
  {
    id: 'csharp',
    label: 'C#',
    icon: 'language-csharp',
    color: '#239120',
  },
  {
    id: 'java',
    label: 'Java',
    icon: 'language-java',
    color: '#E76F00',
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: 'database-search',
    color: '#115e59',
  },
];

export const LEVEL_CONFIG: Record<Level, { label: string; color: string; icon: string }> = {
  junior: {
    label: 'Desenvolvedor Júnior',
    color: '#22C55E',
    icon: 'person-outline',
  },
  pleno: {
    label: 'Desenvolvedor Pleno',
    color: '#F59E0B',
    icon: 'person',
  },
  senior: {
    label: 'Desenvolvedor Sênior',
    color: '#EF4444',
    icon: 'workspace-premium',
  },
};

export const DEBUG_COLORS = {
  primary: '#F59E0B', // Amber
  background: '#151718',
  card: '#1C1F24',
  border: '#30363D',
  text: '#ECEDEE',
  textMuted: '#9BA1A6',
  success: '#22C55E',
  error: '#EF4444',
};
