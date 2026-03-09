import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

import { fetchGlossary, fetchGlossaryByTrack, hasTrackGlossary, syncGlossaryVersion, type GlossaryEntry } from '@/lib/api';

type Glossary = Record<string, GlossaryEntry>;

// Minimum term length to avoid false positives with short words like "C", "Go"
const MIN_TERM_LENGTH = 3;

// ---- Glossary data cache (shared across all instances) ----

let glossaryCache: Glossary | null = null;
let glossaryPattern: RegExp | null = null;
let glossaryLoading = false;
const glossaryListeners: (() => void)[] = [];

/** Build the shared regex once when glossary data arrives */
function buildPattern(glossary: Glossary): RegExp {
  const terms = Object.keys(glossary)
    .filter((t) => t.length >= MIN_TERM_LENGTH)
    .sort((a, b) => b.length - a.length);

  const escaped = terms.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  return new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
}

/**
 * Pre-fetches glossary data so it's ready when GlossaryText renders.
 * Checks for version updates — only re-downloads if glossary changed on server.
 * Safe to call multiple times — only the first call triggers the fetch.
 */
export async function preloadGlossary(): Promise<void> {
  // Check if glossary was updated on server; if so, clear its local cache
  const versionChanged = await syncGlossaryVersion();

  // If version changed and we had a cached copy, reset the in-memory cache
  if (versionChanged && glossaryCache) {
    glossaryCache = null;
    glossaryPattern = null;
    glossaryLoading = false;
  }

  if (glossaryCache || glossaryLoading) return;
  glossaryLoading = true;
  try {
    const data = await fetchGlossary();
    glossaryCache = data;
    glossaryPattern = buildPattern(data);
    for (const l of glossaryListeners) l();
  } catch {
    glossaryLoading = false;
  }
}

function useGlossary() {
  const [glossary, setGlossary] = useState<Glossary | null>(
    glossaryCache,
  );

  useEffect(() => {
    if (glossaryCache) {
      setGlossary(glossaryCache);
      return;
    }

    const listener = () => setGlossary(glossaryCache);
    glossaryListeners.push(listener);

    if (!glossaryLoading) {
      glossaryLoading = true;
      fetchGlossary()
        .then((data) => {
          glossaryCache = data;
          glossaryPattern = buildPattern(data);
          for (const l of glossaryListeners) l();
        })
        .catch(() => {
          glossaryLoading = false;
        });
    }

    return () => {
      const idx = glossaryListeners.indexOf(listener);
      if (idx >= 0) glossaryListeners.splice(idx, 1);
    };
  }, []);

  return glossary;
}

// ---- Track-specific glossary cache ----

const trackGlossaryCache: Record<string, Glossary> = {};
const trackGlossaryPatterns: Record<string, RegExp> = {};
const trackGlossaryLoading: Record<string, boolean> = {};
const trackGlossaryListeners: Record<string, (() => void)[]> = {};

function useTrackGlossary(track: string) {
  const [glossary, setGlossary] = useState<Glossary | null>(
    trackGlossaryCache[track] ?? null,
  );

  useEffect(() => {
    if (trackGlossaryCache[track]) {
      setGlossary(trackGlossaryCache[track]);
      return;
    }

    if (!trackGlossaryListeners[track]) trackGlossaryListeners[track] = [];
    const listener = () => setGlossary(trackGlossaryCache[track] ?? null);
    trackGlossaryListeners[track].push(listener);

    if (!trackGlossaryLoading[track]) {
      trackGlossaryLoading[track] = true;
      fetchGlossaryByTrack(track)
        .then((data) => {
          trackGlossaryCache[track] = data;
          trackGlossaryPatterns[track] = buildPattern(data);
          for (const l of trackGlossaryListeners[track] ?? []) l();
        })
        .catch(() => {
          trackGlossaryLoading[track] = false;
        });
    }

    return () => {
      const listeners = trackGlossaryListeners[track];
      if (listeners) {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
      }
    };
  }, [track]);

  return glossary;
}

function getTrackPattern(track: string): RegExp | null {
  return trackGlossaryPatterns[track] ?? null;
}

// ---- Mini card modal ----

function GlossaryModal({
  entry,
  visible,
  onClose,
}: {
  entry: GlossaryEntry | null;
  visible: boolean;
  onClose: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(screenWidth - 48, 360);

  if (!entry) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            width: cardWidth,
          }}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-2xl border border-[#D1D9E0] bg-white px-5 py-5 shadow-lg dark:border-[#30363D] dark:bg-[#1E2228]">
              <View className="mb-2 flex-row items-center justify-between">
                <View className="rounded-full bg-[#3F51B5]/10 px-3 py-1">
                  <Text className="text-xs font-bold text-[#3F51B5]">
                    GLOSSÁRIO
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  className="h-7 w-7 items-center justify-center rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
                  <Text className="text-xs font-bold text-[#687076] dark:text-[#9BA1A6]">
                    ✕
                  </Text>
                </Pressable>
              </View>

              <Text className="mb-2 text-lg font-bold text-[#11181C] dark:text-[#ECEDEE]">
                {entry.term}
              </Text>
              <Text className="text-sm leading-5 text-[#4B5563] dark:text-[#9BA1A6]">
                {entry.definition}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ---- Main export: renders text with linked glossary terms ----

/**
 * Renders text with technical terms linked to glossary definitions.
 * Terms are highlighted and tappable, opening a mini card overlay.
 *
 * Uses a single shared Modal to avoid mounting one per matched term.
 * The regex is built once when glossary loads (not on every render).
 */
export function GlossaryText({
  text,
  track,
  className: textClassName,
  style,
}: {
  text: string;
  track?: string;
  className?: string;
  style?: object;
}) {
  const useTrack = track && hasTrackGlossary(track);
  const defaultGlossary = useGlossary();
  const trackGlossary = useTrackGlossary(useTrack ? track : '');
  const glossary = useTrack ? trackGlossary : defaultGlossary;
  const pattern = useTrack ? getTrackPattern(track) : glossaryPattern;
  const [activeEntry, setActiveEntry] = useState<GlossaryEntry | null>(null);

  const handleClose = useCallback(() => setActiveEntry(null), []);

  const parts = useMemo(() => {
    if (!glossary || !pattern) return null;

    const result: { text: string; entry?: GlossaryEntry }[] = [];
    // Reset lastIndex in case the shared regex was used before
    pattern.lastIndex = 0;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const seenTerms = new Set<string>();

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ text: text.slice(lastIndex, match.index) });
      }
      const matched = match[0];
      const termKey = matched.toLowerCase();
      const entry = glossary[termKey];
      if (entry && !seenTerms.has(termKey)) {
        seenTerms.add(termKey);
        result.push({ text: matched, entry });
      } else {
        result.push({ text: matched });
      }
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex) });
    }

    return result.length > 0 ? result : null;
  }, [text, glossary, pattern]);

  if (!parts) {
    return (
      <Text className={textClassName} style={style}>
        {text}
      </Text>
    );
  }

  return (
    <>
      <Text className={textClassName} style={style}>
        {parts.map((part, i) =>
          part.entry ? (
            <Text
              key={i}
              onPress={() => setActiveEntry(part.entry!)}
              className="font-bold text-[#3F51B5] underline dark:text-[#A5B4FC]">
              {part.text}
            </Text>
          ) : (
            part.text
          ),
        )}
      </Text>
      <GlossaryModal
        entry={activeEntry}
        visible={activeEntry !== null}
        onClose={handleClose}
      />
    </>
  );
}
