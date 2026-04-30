import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import { router, useNavigation } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Animated,
    BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { QuizStatCard } from "@/components/quiz/stat-card";
import { ConfirmExitModal } from "@/components/ui/confirm-exit-modal";
import { ValidationFab } from "@/components/ui/validation-fab";
import {
    useTabContentPadding,
    useTopContentPadding,
} from "@/hooks/use-tab-content-padding";
import { useAuth } from "@/providers/auth-provider";
import { useData } from "@/providers/data-provider";

import { StudyCompletionOverlay } from "../study-session/components/study-completion-overlay";
import {
    DEBUG_COLORS,
    DEBUG_LANGUAGES,
    LEVEL_CONFIG,
} from "./ache-o-erro.constants";
import {
    DebugPracticeStore,
    GlobalProgress,
    parseCatalogToExercises,
} from "./ache-o-erro.store";
import {
    DebugExercise,
    LanguageInfo,
    Level,
    PlacedToken,
} from "./ache-o-erro.types";
import {
    DebugToken,
    ExerciseCard,
    ExerciseHeader,
    HintsModal,
    LanguageSelector,
    LevelCard,
} from "./components/ache-o-erro-components";

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function AcheOErroScreen() {
  const bottomPadding = useTabContentPadding(-14);
  const topPadding = useTopContentPadding();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { acheOErroCatalog, isPreloading, loadAcheOErroCatalog } = useData();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isSmallScreen = width < 768;

  const LANG_EXTENSION: Record<string, string> = {
    javascript: "bug-fix.js",
    python: "bug-fix.py",
    csharp: "bug-fix.cs",
    java: "BugFix.java",
    sql: "bug-fix.sql",
  };

  // Navigation State
  const [selectedLang, setSelectedLang] = useState<LanguageInfo>(
    DEBUG_LANGUAGES[0],
  );
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [activeExercise, setActiveExercise] = useState<DebugExercise | null>(
    null,
  );

  // Game State
  const [placed, setPlaced] = useState<PlacedToken[]>([]);
  const [pool, setPool] = useState<PlacedToken[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [moveCount, setMoveCount] = useState(0);
  const [userProgress, setUserProgress] = useState<GlobalProgress>({});
  const [lastMovedId, setLastMovedId] = useState<string | null>(null);
  const lastActionRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    loadAcheOErroCatalog();
  }, [loadAcheOErroCatalog]);

  const allExercises = useMemo(
    () => parseCatalogToExercises(acheOErroCatalog),
    [acheOErroCatalog],
  );
  const isLoading = isPreloading || acheOErroCatalog === null;
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // Animation values for completion
  const completionBgOpacity = useRef(new Animated.Value(0)).current;
  const completionIconScale = useRef(new Animated.Value(0)).current;
  const completionTextOpacity = useRef(new Animated.Value(0)).current;
  const completionRingScale = useRef(new Animated.Value(0.8)).current;
  const completionRingOpacity = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const [pendingAction, setPendingAction] = useState<any>(null);
  const isExitingRef = useRef(false);

  // Intercept Hardware/Browser Back
  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      // If we are NOT in an active exercise, or it's finished, let it go
      if (!activeExercise || finished || isExitingRef.current) return;

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Show confirmation
      setPendingAction(e.data.action);
      setConfirmExitOpen(true);
    });

    return unsub;
  }, [navigation, activeExercise, finished]);

  // BackHandler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (activeExercise && !finished && !isExitingRef.current) {
        setConfirmExitOpen(true);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  }, [activeExercise, finished]);

  // Load progress whenever user changes
  useEffect(() => {
    DebugPracticeStore.getProgress(user?.id).then(setUserProgress);
  }, [user?.id]);

  const refreshProgress = useCallback(async () => {
    const p = await DebugPracticeStore.getProgress(user?.id);
    setUserProgress(p);
  }, [user?.id]);

  // Game Logic
  const initExercise = useCallback((ex: DebugExercise) => {
    // Initial code tokens are placed in the "placed" area as a starting point (the buggy code)
    const initialPlaced = ex.code_tokens.map((t) => ({
      instanceId: uid(),
      tokenId: t.id,
      value: t.value,
    }));

    // Extra tokens are in the pool
    const initialPool = ex.extra_tokens.map((t) => ({
      instanceId: uid(),
      tokenId: t.id,
      value: t.value,
    }));

    setPlaced(initialPlaced);
    setPool(initialPool);
    setIsCorrect(null);
    setFinished(false);
    setMoveCount(0);
    setStartTime(Date.now());
    setLastMovedId(null);
  }, []);

  const handleSelectExercise = useCallback(
    (ex: DebugExercise) => {
      setActiveExercise(ex);
      setCurrentHintIndex(0);
      setShowHintsModal(false);
      initExercise(ex);
    },
    [initExercise],
  );

  const handleBack = useCallback(async () => {
    if (activeExercise) {
      setActiveExercise(null);
      await refreshProgress();
    } else if (selectedLevel) {
      setSelectedLevel(null);
    } else {
      router.back();
    }
  }, [activeExercise, selectedLevel, refreshProgress]);

  const playSound = useCallback(async (type: "concluido" | "erro") => {
    try {
      const source =
        type === "concluido"
          ? require("../../../assets/songs/concluido.mp3")
          : require("../../../assets/songs/erro.mp3");
      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (err) {
      console.log("Error playing sound", err);
    }
  }, []);

  const handleValidate = useCallback(async () => {
    if (!activeExercise) return;

    const currentOrder = placed.map((p) => p.tokenId);
    const isCorrectOrder =
      JSON.stringify(currentOrder) ===
      JSON.stringify(activeExercise.correct_order);

    if (isCorrectOrder) {
      setIsCorrect(true);
      const timeSecs = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;
      setElapsedTime(timeSecs);

      await DebugPracticeStore.saveResult(
        activeExercise.id,
        timeSecs,
        moveCount,
        activeExercise.language,
        activeExercise.level,
        user?.id,
      );
      await playSound("concluido");

      // Completion Overlay animation
      setShowCompletionEffect(true);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(completionBgOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(completionIconScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(completionTextOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(completionRingScale, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(completionRingOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.timing(completionBgOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCompletionEffect(false);
        setFinished(true);
      });
    } else {
      setIsCorrect(false);
      await playSound("erro");
      setTimeout(() => setIsCorrect(null), 1500);
    }
  }, [
    activeExercise,
    placed,
    moveCount,
    startTime,
    user?.id,
    playSound,
    completionBgOpacity,
    completionIconScale,
    completionTextOpacity,
    completionRingScale,
    completionRingOpacity,
  ]);

  const handleNextExercise = useCallback(() => {
    if (!activeExercise) return;
    const currentList = allExercises.filter(
      (e) => e.language === selectedLang.id && e.level === selectedLevel,
    );
    const currIdx = currentList.findIndex((e) => e.id === activeExercise.id);
    const next = currentList[currIdx + 1];
    if (next) {
      handleSelectExercise(next);
    } else {
      handleBack();
    }
  }, [
    activeExercise,
    allExercises,
    selectedLang.id,
    selectedLevel,
    handleSelectExercise,
    handleBack,
  ]);

  // Drag & Drop Handlers
  const handleRemoveFromPlaced = (instanceId: string) => {
    const item = placed.find((p) => p.instanceId === instanceId);
    if (!item) return;

    setPlaced((prev) => prev.filter((p) => p.instanceId !== instanceId));
    setPool((prev) => [...prev, item]);

    setLastMovedId(null);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  };

  const handleAddToPlaced = (instanceId: string, index?: number) => {
    const now = Date.now();
    if (
      lastActionRef.current &&
      lastActionRef.current.id === instanceId &&
      now - lastActionRef.current.time < 400
    ) {
      return;
    }
    lastActionRef.current = { id: instanceId, time: now };

    const item = pool.find((p) => p.instanceId === instanceId);
    if (!item) return;

    setPool((prev) => prev.filter((p) => p.instanceId !== instanceId));
    setPlaced((prev) => {
      const copy = [...prev];
      if (index !== undefined) {
        copy.splice(index, 0, item);
      } else {
        copy.push(item);
      }
      return copy;
    });
    setLastMovedId(item.instanceId);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  };

  const handleReorderPlaced = (instanceId: string, targetIndex: number) => {
    const now = Date.now();
    if (
      lastActionRef.current &&
      lastActionRef.current.id === instanceId &&
      now - lastActionRef.current.time < 400
    ) {
      return;
    }
    lastActionRef.current = { id: instanceId, time: now };

    setPlaced((prev) => {
      const fromIdx = prev.findIndex((p) => p.instanceId === instanceId);
      if (fromIdx === -1 || fromIdx === targetIndex) return prev;
      const item = prev[fromIdx];
      const without = [...prev.slice(0, fromIdx), ...prev.slice(fromIdx + 1)];
      const insertAt = targetIndex > fromIdx ? targetIndex - 1 : targetIndex;
      without.splice(Math.min(insertAt, without.length), 0, item);
      return without;
    });
    setLastMovedId(instanceId);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  };

  const handleSwapCodeToCode = (dragId: string, dropId: string) => {
    setPlaced((prev) => {
      const dragIdx = prev.findIndex((p) => p.instanceId === dragId);
      const dropIdx = prev.findIndex((p) => p.instanceId === dropId);
      if (dragIdx === -1 || dropIdx === -1 || dragIdx === dropIdx) return prev;

      const copy = [...prev];
      const temp = copy[dragIdx];
      copy[dragIdx] = copy[dropIdx];
      copy[dropIdx] = temp;
      return copy;
    });
    setLastMovedId(dragId);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  };

  const handleSwapPoolToCode = (poolId: string, codeId: string) => {
    const poolItem = pool.find((p) => p.instanceId === poolId);
    const codeItem = placed.find((p) => p.instanceId === codeId);
    if (!poolItem || !codeItem) return;

    setPlaced((prev) => {
      const copy = [...prev];
      const dropIdx = copy.findIndex((p) => p.instanceId === codeId);
      if (dropIdx > -1) {
        copy[dropIdx] = poolItem;
      }
      return copy;
    });

    setPool((prev) => {
      const withoutDragged = prev.filter((p) => p.instanceId !== poolId);
      return [...withoutDragged, codeItem];
    });

    setLastMovedId(poolItem.instanceId);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  };

  const parseDragPayload = useCallback((payload: string) => {
    if (payload.startsWith("pool_"))
      return {
        source: "pool" as const,
        instanceId: payload.replace("pool_", ""),
      };
    if (payload.startsWith("code_"))
      return {
        source: "code" as const,
        instanceId: payload.replace("code_", ""),
      };
    return null;
  }, []);

  const placedRows = useMemo(() => {
    const rows: {
      tokens: (PlacedToken & { globalIndex: number })[];
      indent: number;
    }[] = [];
    let currentTokens: (PlacedToken & { globalIndex: number })[] = [];
    let currentIndent = 0;

    placed.forEach((p, idx) => {
      const val = p.value.trim();
      if (val === "}") {
        if (currentTokens.length > 0) {
          rows.push({ tokens: currentTokens, indent: currentIndent });
          currentTokens = [];
        }
        currentIndent = Math.max(0, currentIndent - 1);
        currentTokens.push({ ...p, globalIndex: idx });
        const next = placed[idx + 1];
        if (
          next &&
          (next.value.trim().toLowerCase() === "else" ||
            next.value.trim() === ";")
        ) {
          // Keep together
        } else {
          rows.push({ tokens: currentTokens, indent: currentIndent });
          currentTokens = [];
        }
      } else {
        currentTokens.push({ ...p, globalIndex: idx });
        if (val === "{" || val === ";" || val === ":") {
          rows.push({ tokens: currentTokens, indent: currentIndent });
          currentTokens = [];
          if (val === "{" || val === ":") currentIndent++;
        }
      }
    });

    if (currentTokens.length > 0)
      rows.push({ tokens: currentTokens, indent: currentIndent });
    return rows;
  }, [placed]);

  const correctFlags = useMemo(() => {
    if (!activeExercise || !activeExercise.correct_order) return [];
    let allCorrect = true;
    return placed.map((p, i) => {
      if (!allCorrect) return false;
      allCorrect = p.tokenId === activeExercise.correct_order[i];
      return allCorrect;
    });
  }, [placed, activeExercise]);

  // Rendering Helpers
  const renderSelection = () => {
    const langExercises = allExercises.filter(
      (e) => e.language === selectedLang.id,
    );
    const levelsAvailable = Array.from(
      new Set(langExercises.map((e) => e.level)),
    ) as Level[];

    if (!selectedLevel) {
      const levelsOrder: Level[] = ["junior", "pleno", "senior"];
      const sortedLevels = levelsOrder.filter((l) =>
        levelsAvailable.includes(l),
      );

      return (
        <View style={[{ flex: 1 }, styles.maxContentWidth]}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              paddingHorizontal: 16,
              marginTop: 12,
            }}
          >
            {sortedLevels.map((level) => {
              const count = langExercises.filter(
                (e) => e.level === level,
              ).length;
              const completedCount = langExercises.filter(
                (e) => e.level === level && userProgress[e.id]?.completed,
              ).length;
              return (
                <LevelCard
                  key={level}
                  level={level}
                  count={count}
                  completedCount={completedCount}
                  onPress={() => setSelectedLevel(level)}
                />
              );
            })}
          </View>
        </View>
      );
    }

    const levelExercises = langExercises
      .filter((e) => e.level === selectedLevel)
      .sort((a, b) => a.title.localeCompare(b.title));

    return (
      <View
        style={[{ flex: 1, paddingHorizontal: 20 }, styles.maxContentWidth]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedLevel(null)}
            style={styles.backButton}
          >
            <MaterialIcons
              name="arrow-back"
              size={20}
              color={isDark ? "#ECEDEE" : "#11181C"}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: isDark ? "#ECEDEE" : "#11181C",
            }}
          >
            {LEVEL_CONFIG[selectedLevel].label}
          </Text>
        </View>
        {levelExercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onPress={() => handleSelectExercise(ex)}
            completed={userProgress[ex.id]?.completed}
          />
        ))}
      </View>
    );
  };

  const renderGame = () => {
    if (!activeExercise) return null;
    const hints = activeExercise.hints ?? [];
    const totalHints = hints.length;
    const hasNextHint = currentHintIndex < totalHints - 1;

    if (finished) {
      return (
        <ScrollView
          contentContainerStyle={[
            styles.resultsContainer,
            { paddingTop: topPadding + 20 },
          ]}
        >
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <MaterialIcons
                  name="emoji-events"
                  size={48}
                  color={DEBUG_COLORS.success}
                />
              </View>
            </View>
            <Text style={styles.resultTitle}>EXCELENTE!</Text>
            <Text style={styles.resultSubtitle}>
              Bugs corrigidos com sucesso!
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <QuizStatCard
              label="tempo"
              value={`${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, "0")}`}
              icon="timer"
              accentColor={DEBUG_COLORS.primary}
              backgroundColor="rgba(245,158,11,0.09)"
              borderColor="rgba(245,158,11,0.25)"
              valueColor={DEBUG_COLORS.primary}
              subtitleColor={DEBUG_COLORS.textMuted}
              style={{ flex: 1 }}
              align="center"
            />
            <QuizStatCard
              label="movimentos"
              value={moveCount.toString()}
              icon="touch-app"
              accentColor={DEBUG_COLORS.success}
              backgroundColor="rgba(34,197,94,0.09)"
              borderColor="rgba(34,197,94,0.25)"
              valueColor={DEBUG_COLORS.success}
              subtitleColor={DEBUG_COLORS.textMuted}
              style={{ flex: 1 }}
              align="center"
            />
          </View>

          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>Explicação:</Text>
            <Text style={styles.explanationText}>
              {activeExercise.explanation}
            </Text>
          </View>

          <View
            style={{ gap: 12, marginTop: 24, width: "100%", maxWidth: 400 }}
          >
            <TouchableOpacity
              onPress={handleNextExercise}
              style={styles.primaryButton}
            >
              <MaterialIcons name="arrow-forward" size={20} color="#000" />
              <Text style={styles.primaryButtonText}>Próximo Exercício</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.secondaryButton}
            >
              <MaterialIcons
                name="grid-view"
                size={20}
                color={isDark ? "#ECEDEE" : "#11181C"}
              />
              <Text style={styles.secondaryButtonText}>Voltar para Lista</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <DraxProvider>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          >
            <View style={styles.maxContentWidth}>
              <ExerciseHeader
                exercise={activeExercise}
                isDark={isDark}
                hintCount={totalHints}
                onClose={() => setConfirmExitOpen(true)}
                onOpenHints={() => {
                  setCurrentHintIndex(0);
                  setShowHintsModal(true);
                }}
              />

              {/* Code Editor Area */}
              <View
                style={[
                  styles.codeArea,
                  {
                    borderColor:
                      isCorrect === false ? DEBUG_COLORS.error : "#1E2328",
                    backgroundColor: "#0B0D0F",
                    padding: 16,
                    margin: 16,
                    minHeight: 300,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 10,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#FF5F56",
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#FFBD2E",
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#27C93F",
                    }}
                  />
                  <Text
                    style={{
                      color: "#4B5563",
                      fontSize: 11,
                      fontWeight: "700",
                      marginLeft: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {LANG_EXTENSION[selectedLang.id] ?? "bug-fix.js"}
                  </Text>
                </View>

                {placedRows.map((row, rowIdx) => (
                  <View
                    key={`row-${rowIdx}`}
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginLeft: row.indent * 24,
                      marginBottom: 4,
                    }}
                  >
                    {row.tokens.map((p) => (
                      <View
                        key={p.instanceId}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <DraxView
                          receptive
                          onReceiveDragDrop={(e) => {
                            const drag = parseDragPayload(
                              e.dragged.payload as string,
                            );
                            if (!drag) return;
                            if (drag.source === "pool")
                              handleAddToPlaced(drag.instanceId, p.globalIndex);
                            if (drag.source === "code")
                              handleReorderPlaced(
                                drag.instanceId,
                                p.globalIndex,
                              );
                          }}
                        >
                          <View style={{ width: 4, height: 32 }} />
                        </DraxView>

                        <DebugToken
                          token={{ id: p.tokenId, value: p.value }}
                          instanceId={p.instanceId}
                          variant="code"
                          isSelected={selectedTokenId === p.instanceId}
                          onToggleSelect={() => setSelectedTokenId(prev => prev === p.instanceId ? null : p.instanceId)}
                          onMoveLeft={() => {
                            if (p.globalIndex > 0) {
                              handleReorderPlaced(p.instanceId, p.globalIndex - 1);
                            }
                          }}
                          onMoveRight={() => {
                            if (p.globalIndex < placed.length - 1) {
                              handleReorderPlaced(p.instanceId, p.globalIndex + 2);
                            }
                          }}
                          onRemove={() => {
                            handleRemoveFromPlaced(p.instanceId);
                            if (selectedTokenId === p.instanceId) setSelectedTokenId(null);
                          }}
                          receptive
                          isCorrectPosition={
                            correctFlags[p.globalIndex] || false
                          }
                          isLastMoved={lastMovedId === p.instanceId}
                          onReceiveDragDrop={(e) => {
                            const drag = parseDragPayload(
                              e.dragged.payload as string,
                            );
                            if (!drag) return;
                            if (drag.source === "pool")
                              handleSwapPoolToCode(drag.instanceId, p.instanceId);
                            if (drag.source === "code")
                              handleSwapCodeToCode(drag.instanceId, p.instanceId);
                          }}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              {/* Instructions */}
              <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: "#1C1F24",
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#30363D",
                  }}
                >
                  <Text
                    style={{
                      color: "#9BA1A6",
                      fontSize: 13,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    <MaterialIcons
                      name="info-outline"
                      size={14}
                      color="#22C55E"
                    />{" "}
                    Encontre a lógica incorreta e substitua pelas peças corretas
                    da barra inferior.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Panel (Tools) */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#111316",
              paddingBottom: Math.max(insets.bottom, 16),
              paddingTop: 16,
              paddingHorizontal: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 20,
            }}
          >
            <View
              style={[
                styles.maxContentWidth,
                {
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 4,
                },
              ]}
            >
              {pool.map((p) => (
                <DebugToken
                  key={p.instanceId}
                  token={{ id: p.tokenId, value: p.value }}
                  instanceId={p.instanceId}
                  variant="pool"
                  onPress={() => handleAddToPlaced(p.instanceId)}
                />
              ))}
            </View>
          </View>
        </DraxProvider>

        <HintsModal
          visible={showHintsModal}
          hints={hints}
          currentHintIndex={currentHintIndex}
          onClose={() => setShowHintsModal(false)}
          onNextHint={() =>
            setCurrentHintIndex((idx) => Math.min(idx + 1, totalHints - 1))
          }
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: topPadding }]}>
        {!activeExercise && (
          <>
            <View
              style={{ paddingHorizontal: 20, marginBottom: 24, marginTop: 20 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("/(features)/(main)/practice")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? "#1C1F24" : "#F1F5F9",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: isDark ? "#30363D" : "#E2E8F0",
                  }}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={20}
                    color={isDark ? "#ECEDEE" : "#11181C"}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "900",
                    color: isDark ? "#ECEDEE" : "#11181C",
                    letterSpacing: -0.5,
                  }}
                >
                  Ache o Erro
                </Text>
              </View>
              <Text
                style={{
                  color: DEBUG_COLORS.textMuted,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Analise o código, encontre a falha e posicione as peças corretas
                para resolver o bug.
              </Text>
            </View>

            <View style={styles.maxContentWidth}>
              <LanguageSelector
                languages={DEBUG_LANGUAGES}
                selected={selectedLang}
                onSelect={(lang) => {
                  setSelectedLang(lang);
                  setSelectedLevel(null);
                }}
              />
            </View>
          </>
        )}

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={DEBUG_COLORS.primary} />
          </View>
        ) : activeExercise ? (
          renderGame()
        ) : (
          renderSelection()
        )}

        <StudyCompletionOverlay
          visible={showCompletionEffect}
          correctCount={1}
          totalCards={1}
          backgroundOpacity={completionBgOpacity}
          iconScale={completionIconScale}
          textOpacity={completionTextOpacity}
          ringScale={completionRingScale}
          ringOpacity={completionRingOpacity}
          title="Bug Corrigido!"
          subtitle="Você encontrou o erro corretamente."
        />

        <ConfirmExitModal
          visible={confirmExitOpen}
          onConfirm={() => {
            setConfirmExitOpen(false);
            isExitingRef.current = true;
            if (pendingAction) {
              navigation.dispatch(pendingAction);
            } else {
              handleBack();
            }
          }}
          onCancel={() => {
            setConfirmExitOpen(false);
            setPendingAction(null);
          }}
          title="Sair do Exercício?"
          message="Seu progresso neste exercício será perdido."
        />
        {activeExercise && !finished && (
          <ValidationFab
            onPress={handleValidate}
            disabled={placed.length === 0}
            icon="check"
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEBUG_COLORS.background,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1C1F24",
    alignItems: "center",
    justifyContent: "center",
  },
  codeArea: {
    margin: 8,
    backgroundColor: "#0D0F12",
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 200,
    overflow: "hidden",
  },
  poolArea: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E2328",
  },
  poolTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: DEBUG_COLORS.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dropZone: {
    width: 4,
    height: 32,
  },
  resultsContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  maxContentWidth: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(34,197,94,0.3)",
    backgroundColor: "rgba(34,197,94,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(34,197,94,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: DEBUG_COLORS.success,
    letterSpacing: -1,
  },
  resultSubtitle: {
    color: DEBUG_COLORS.textMuted,
    fontSize: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
    width: "100%",
    maxWidth: 400,
  },
  explanationCard: {
    backgroundColor: "#1C1F24",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#30363D",
    width: "100%",
    maxWidth: 400,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ECEDEE",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: DEBUG_COLORS.textMuted,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: DEBUG_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#1C1F24",
    borderWidth: 1,
    borderColor: "#30363D",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#ECEDEE",
    fontSize: 16,
    fontWeight: "800",
  },
});
