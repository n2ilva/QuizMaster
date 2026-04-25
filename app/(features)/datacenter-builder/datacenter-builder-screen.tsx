import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  BackHandler,
} from "react-native";

import { ConfirmExitModal } from "@/components/ui/confirm-exit-modal";
import { ValidationFab } from "@/components/ui/validation-fab";
import { useTabContentPadding, useTopContentPadding } from "@/hooks/use-tab-content-padding";
import {
  fetchDataCenterProgress,
  saveDataCenterResult,
} from "@/lib/api/datacenter";
import { useAuth } from "@/providers/auth-provider";
import { useData } from "@/providers/data-provider";

import { DcModal } from "./components/dc-modal";
import { LevelCard } from "./components/level-card";
import { WorkbenchCanvas } from "./components/workbench-canvas";
import { WorkbenchToolbar } from "./components/workbench-toolbar";
import {
  DC_BREAKPOINTS,
  DC_CABLE_VISUALS,
  DC_COLORS,
  DC_RADII,
} from "./datacenter-builder.constants";
import {
  getCableVisual,
  getDeviceIcon,
  makeConnectionId,
} from "./datacenter-builder.helpers";
import type {
  ActiveConnection,
  Cable,
  DataCenterData,
  DataCenterLevel,
  InventoryDevice,
  PortStatusMap,
} from "./datacenter-builder.types";

/**
 * Stable empty set used as the default `completedTokens` prop for the
 * manual panel. Using a module-level constant avoids creating a new
 * reference on every render, which would break child memoization.
 */
const EMPTY_TOKEN_SET: ReadonlySet<string> = new Set();

/**
 * Fallback usado enquanto o `datacenterCatalog` ainda não chegou do Firestore
 * (loading inicial). Mantém a tela renderizável sem quebrar.
 */
const EMPTY_CATALOG: DataCenterData = {
  game: { name: "DataCenter Builder", version: "0" },
  cable_types: [],
  levels: [],
} as unknown as DataCenterData;

/**
 * Normaliza o catálogo bruto (vindo do Firestore) — alguns cenários no JSON
 * omitem `inventory`, `connections_required` ou `rules`; garantimos arrays.
 *
 * Também filtra níveis que só existem como documentação (sem `inventory`
 * preenchido), como os tiers Multi-Site e Hyperscale — sem inventário o
 * usuário não teria equipamentos para instalar no rack.
 */
function normalizeCatalog(raw: unknown): DataCenterData {
  if (!raw) return EMPTY_CATALOG;
  const src = raw as DataCenterData;
  return {
    ...src,
    cable_types: src.cable_types ?? [],
    levels: (src.levels ?? [])
      .map((lvl) => ({
        ...lvl,
        inventory: lvl.inventory ?? [],
        connections_required: lvl.connections_required ?? [],
        rules: lvl.rules ?? [],
      }))
      .filter((lvl) => lvl.inventory.length > 0),
  };
}

/**
 * Datacenter Builder — top-level screen.
 *
 * Orchestrates level selection, rack installation, cable wiring and validation.
 * All heavy rendering is delegated to WorkbenchCanvas; modals use DcModal;
 * responsive chrome via DC_BREAKPOINTS (`stackCanvas`, `compactChrome`).
 */
export function DataCenterBuilderScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const topPadding = useTopContentPadding();
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { datacenterCatalog, loadDatacenterCatalog, isPreloading } = useData();

  useEffect(() => {
    loadDatacenterCatalog();
  }, [loadDatacenterCatalog]);

  // Catálogo vem do Firestore via DataProvider (preload). Enquanto não chega,
  // usamos um fallback vazio para não quebrar renderização.
  const data = useMemo(() => normalizeCatalog(datacenterCatalog), [datacenterCatalog]);

  const isCompactChrome = windowWidth < DC_BREAKPOINTS.compactChrome;
  const isStackedCanvas = windowWidth < DC_BREAKPOINTS.stackCanvas;

  // ----------------------------------------------------------------- state
  const [activeLevel, setActiveLevel] = useState<DataCenterLevel | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());

  const [installedDevices, setInstalledDevices] = useState<Record<number, InventoryDevice>>({});
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [sourceNode, setSourceNode] = useState<{ deviceId: string; port: string } | null>(null);
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null);
  const [selectedSlotForInstall, setSelectedSlotForInstall] = useState<number | null>(null);
  const [consoleDevice, setConsoleDevice] = useState<InventoryDevice | null>(null);
  const [movements, setMovements] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [ledOn, setLedOn] = useState(true);

  const [showCableMenu, setShowCableMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [manualCollapsed, setManualCollapsed] = useState(false);
  /**
   * In mobile/stacked layouts we show either the rack OR the notebook at a
   * time — never both — so the visualization stays legible on small screens.
   * This is ignored by `WorkbenchCanvas` on desktop widths.
   *
   *  - "rack"     → rack visible + install manual below.
   *  - "notebook" → laptop + console cable visible + CLI manual below.
   *
   * The view auto-switches to "notebook" the first time the user connects a
   * console cable, and snaps back to "rack" when the user closes the
   * terminal.
   */
  const [mobileView, setMobileView] = useState<"rack" | "notebook">("rack");
  /**
   * CLI validation tokens the user has already completed, keyed by device id.
   * The terminal emits `onSectionCompleted(token, section)` as the user types
   * a section's full command sequence; we accumulate them here so the
   * Manual panel can render progress checkmarks.
   */
  const [completedCliTokensByDevice, setCompletedCliTokensByDevice] = useState<
    Record<string, Set<string>>
  >({});
  const [validationError, setValidationError] = useState<
    { title: string; message: string; items?: string[] } | null
  >(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const navigation = useNavigation();
  const [pendingAction, setPendingAction] = useState<any>(null);
  const isExitingRef = useRef(false);

  // Intercept Hardware/Browser Back
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      // If we are NOT in an active exercise, or it's finished, let it go
      if (!activeLevel || showSuccess || isExitingRef.current) return;

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Show confirmation
      setPendingAction(e.data.action);
      setConfirmExitOpen(true);
    });

    return unsub;
  }, [navigation, activeLevel, showSuccess]);

  // BackHandler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (activeLevel && !showSuccess && !isExitingRef.current) {
        setConfirmExitOpen(true);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [activeLevel, showSuccess]);

  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.6)).current;

  // ----------------------------------------------------------- keyboard UX
  // When the terminal TextInput gains focus on mobile/web mobile, the soft
  // keyboard covers the bottom of the screen — which is exactly where the
  // laptop sits in stacked layout. We scroll the workbench so the laptop
  // rises above the keyboard, and we reserve bottom padding for it.
  const workbenchScrollRef = useRef<ScrollView | null>(null);
  const canvasSurfaceYRef = useRef<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [consoleFocused, setConsoleFocused] = useState(false);
  const pendingLaptopYRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return; // web handled via onFocus directly
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const s = Keyboard.addListener(showEvt, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
      const y = pendingLaptopYRef.current;
      if (y != null) {
        // Slight delay so layout has settled after padding update.
        setTimeout(() => {
          workbenchScrollRef.current?.scrollTo({
            y: Math.max(0, y - 40),
            animated: true,
          });
        }, 40);
      }
    });
    const h = Keyboard.addListener(hideEvt, () => setKeyboardHeight(0));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  const handleConsoleInputFocusChange = useCallback(
    (focused: boolean, laptopAbsoluteYWithinCanvas: number) => {
      setConsoleFocused(focused);
      // Translate canvas-local Y into the screen ScrollView's coordinate
      // space by adding the canvas surface's own Y offset within the scroll.
      const targetY = canvasSurfaceYRef.current + laptopAbsoluteYWithinCanvas;
      pendingLaptopYRef.current = focused ? targetY : null;
      // Web mobile: the viewport resizes automatically but the ScrollView
      // doesn't follow, so we manually scroll to the laptop.
      if (focused && Platform.OS === "web") {
        // Wait one tick so the browser's virtual keyboard animation starts.
        setTimeout(() => {
          workbenchScrollRef.current?.scrollTo({
            y: Math.max(0, targetY - 40),
            animated: true,
          });
        }, 100);
      }
    },
    [],
  );

  /**
   * Per-port status used to drive the LED colors on the rack.
   * Key: `${deviceId}.${portId}`. The screen is the only place that knows
   * both the level's required connections and the user's current wiring,
   * so the map is computed here and passed down.
   */
  const portStatus = useMemo<PortStatusMap>(() => {
    const map: PortStatusMap = {};
    if (!activeLevel) return map;

    // Build a quick lookup of required cable per endpoint key.
    // Keys are normalized so "laptop.serial" aliases "laptop.console".
    const normalize = (k: string) => (k === "laptop.serial" ? "laptop.console" : k);
    const required: Record<string, string> = {};
    activeLevel.connections_required.forEach((req) => {
      required[normalize(req.from)] = req.cable;
      required[normalize(req.to)] = req.cable;
    });

    // Every installed port starts as "idle" unless there's a connection.
    Object.values(installedDevices).forEach((dev) => {
      dev.ports.forEach((p) => {
        map[`${dev.id}.${p.id}`] = "idle";
      });
    });

    // Walk current connections and resolve status per endpoint.
    connections.forEach((conn) => {
      const endpoints: { deviceId: string; port: string }[] = [conn.from];
      if (conn.to) endpoints.push(conn.to);

      endpoints.forEach((ep) => {
        // Skip the laptop — it's not drawn inside the rack.
        if (ep.deviceId === "laptop") return;
        const key = `${ep.deviceId}.${ep.port}`;
        const expected = required[key];
        if (!expected) {
          map[key] = "unneeded";
          return;
        }
        map[key] = conn.cableId === expected ? "ok" : "wrong";
      });
    });

    return map;
  }, [activeLevel, connections, installedDevices]);

  // ----------------------------------------------------------------- effects
  useEffect(() => {
    const t = setInterval(() => setLedOn((v) => !v), 600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchDataCenterProgress(user.id)
      .then((results) => {
        const done = new Set<number>();
        Object.keys(results).forEach((id) => {
          if (results[id].completed) done.add(parseInt(id, 10));
        });
        setCompletedLevels(done);
      })
      .catch(() => {
        /* progress is non-critical */
      });
  }, [user?.id]);

  // ----------------------------------------------------------------- audio
  const playSound = useCallback(async (type: "success" | "complete" | "error") => {
    try {
      const file =
        type === "complete"
          ? require("@/assets/songs/concluido.mp3")
          : type === "success"
            ? require("@/assets/songs/acertou.mp3")
            : require("@/assets/songs/erro.mp3");
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
    } catch {
      /* audio is best-effort */
    }
  }, []);

  // ----------------------------------------------------------------- level
  const handleLevelSelect = useCallback((level: DataCenterLevel) => {
    setActiveLevel(level);
    setInstalledDevices({});
    setConnections([]);
    setSourceNode(null);
    setSelectedCable(null);
    setConsoleDevice(null);
    setMovements(0);
    setStartTime(Date.now());
    setValidationError(null);
  }, []);

  const handleLeaveLevel = useCallback(() => {
    // Fully cancel the current exercise: drop the active level and wipe all
    // per-exercise state (rack contents, wiring, console session, timers,
    // transient modals) so the level list reflects a clean slate.
    setActiveLevel(null);
    setInstalledDevices({});
    setConnections([]);
    setSourceNode(null);
    setSelectedCable(null);
    setSelectedSlotForInstall(null);
    setConsoleDevice(null);
    setMovements(0);
    setStartTime(null);
    setShowCableMenu(false);
    setShowInstallHelp(false);
    setValidationError(null);
    setCompletedCliTokensByDevice({});
    setMobileView("rack");
  }, []);

  // Auto-switch the mobile view to "notebook" the moment the user connects a
  // console cable, and snap back to "rack" when the console session ends.
  // On desktop widths `mobileView` is ignored so this is a no-op there.
  useEffect(() => {
    if (consoleDevice) {
      setMobileView("notebook");
    } else {
      setMobileView("rack");
    }
  }, [consoleDevice]);

  // ----------------------------------------------------------------- install
  const handleInstallItem = useCallback(
    (device: InventoryDevice) => {
      if (selectedSlotForInstall === null) return;
      setInstalledDevices((prev) => ({ ...prev, [selectedSlotForInstall]: device }));
      setMovements((m) => m + 1);
      setSelectedSlotForInstall(null);
    },
    [selectedSlotForInstall],
  );

  const handleUninstall = useCallback(
    (slotIndex: number) => {
      const removed = installedDevices[slotIndex];
      setInstalledDevices((prev) => {
        const copy = { ...prev };
        delete copy[slotIndex];
        return copy;
      });
      if (removed) {
        setConnections((conns) =>
          conns.filter(
            (c) =>
              c.from.deviceId !== removed.id &&
              c.to?.deviceId !== removed.id,
          ),
        );
        if (consoleDevice?.id === removed.id) setConsoleDevice(null);
      }
      setMovements((m) => m + 1);
    },
    [installedDevices, consoleDevice],
  );

  // ----------------------------------------------------------------- wiring
  const handlePortPress = useCallback(
    (deviceId: string, port: string) => {
      if (!activeLevel) return;

      // Note: intentionally no "all hardware must be installed first" gate —
      // the user is free to install a device and immediately wire/configure
      // it without populating the rest of the rack.

      // Clicking an already-connected port disconnects it.
      const existing = connections.find(
        (c) =>
          (c.from.deviceId === deviceId && c.from.port === port) ||
          (c.to?.deviceId === deviceId && c.to?.port === port),
      );
      if (existing) {
        if (existing.cableId === "console") setConsoleDevice(null);
        setConnections((conns) => conns.filter((c) => c.id !== existing.id));
        setMovements((m) => m + 1);
        return;
      }

      // First click — mark source and open cable picker.
      if (!sourceNode) {
        setSourceNode({ deviceId, port });
        setShowCableMenu(true);
        return;
      }

      // Second click on the same port cancels.
      if (sourceNode.deviceId === deviceId && sourceNode.port === port) {
        setSourceNode(null);
        setSelectedCable(null);
        return;
      }

      if (!selectedCable) {
        setSourceNode(null);
        return;
      }

      // Console cable requires laptop ⇄ device's console/serial port.
      if (selectedCable.id === "console") {
        const srcIsLaptop = sourceNode.deviceId === "laptop";
        const dstIsLaptop = deviceId === "laptop";
        const srcIsConsole = sourceNode.port === "console" || sourceNode.port === "serial";
        const dstIsConsole = port === "console" || port === "serial";

        if ((srcIsLaptop && dstIsConsole) || (dstIsLaptop && srcIsConsole)) {
          const deviceIdResolved = srcIsLaptop ? deviceId : sourceNode.deviceId;
          const device = Object.values(installedDevices).find((d) => d.id === deviceIdResolved);
          if (device) {
            setConsoleDevice(device);
            setConnections((conns) => [
              ...conns,
              {
                id: makeConnectionId(),
                from: sourceNode,
                to: { deviceId, port },
                cableId: "console",
              },
            ]);
            setMovements((m) => m + 1);
          }
        } else {
          setValidationError({
            title: "Conexão inválida",
            message:
              "O cabo de console conecta o notebook diretamente à porta de gerenciamento do equipamento.",
          });
        }
        setSourceNode(null);
        setSelectedCable(null);
        return;
      }

      setConnections((conns) => [
        ...conns,
        {
          id: makeConnectionId(),
          from: sourceNode,
          to: { deviceId, port },
          cableId: selectedCable.id,
        },
      ]);
      setSourceNode(null);
      setSelectedCable(null);
      setMovements((m) => m + 1);
    },
    [activeLevel, connections, installedDevices, selectedCable, sourceNode],
  );

  const handleLaptopSerialPress = useCallback(() => {
    handlePortPress("laptop", "console");
  }, [handlePortPress]);

  /**
   * Mobile/stacked shortcut: when the user picks the console cable after
   * selecting a device's console/serial port as source, there's no laptop
   * visible on screen to click. Finish the wiring in one step by linking
   * the source port directly to `laptop.console`.
   *
   * Returns true when it handled the connection (caller should skip the
   * usual "wait for second port click" flow).
   */
  const tryAutoConnectConsoleToLaptop = useCallback((): boolean => {
    if (!sourceNode) return false;
    if (sourceNode.deviceId === "laptop") return false;
    const srcIsConsole =
      sourceNode.port === "console" || sourceNode.port === "serial";
    if (!srcIsConsole) return false;

    const device = Object.values(installedDevices).find(
      (d) => d.id === sourceNode.deviceId,
    );
    if (!device) return false;

    setConsoleDevice(device);
    setConnections((conns) => [
      ...conns,
      {
        id: makeConnectionId(),
        from: sourceNode,
        to: { deviceId: "laptop", port: "console" },
        cableId: "console",
      },
    ]);
    setMovements((m) => m + 1);
    setSourceNode(null);
    setSelectedCable(null);
    return true;
  }, [installedDevices, sourceNode]);

  /**
   * When the user finishes typing a full CLI section in the terminal,
   * persist its validation token so the Manual panel can mark it as done.
   */
  const handleConsoleSectionCompleted = useCallback(
    (token: string, _section: string) => {
      if (!consoleDevice) return;
      setCompletedCliTokensByDevice((prev) => {
        const deviceId = consoleDevice.id;
        const current = prev[deviceId] ?? new Set<string>();
        if (current.has(token)) return prev;
        const next = new Set(current);
        next.add(token);
        return { ...prev, [deviceId]: next };
      });
    },
    [consoleDevice],
  );

  // ----------------------------------------------------------------- validate
  const handleValidate = useCallback(() => {
    if (!activeLevel) return;

    const missing: string[] = [];
    const wrong: string[] = [];

    activeLevel.connections_required.forEach((req) => {
      // Normalize the alias "laptop.serial" → "laptop.console"
      const targetFrom = req.from === "laptop.serial" ? "laptop.console" : req.from;
      const targetTo = req.to === "laptop.serial" ? "laptop.console" : req.to;

      const conn = connections.find((c) => {
        const cf = `${c.from.deviceId}.${c.from.port}`;
        const ct = c.to ? `${c.to.deviceId}.${c.to.port}` : "";
        return (
          (targetFrom === cf && targetTo === ct) ||
          (targetFrom === ct && targetTo === cf)
        );
      });

      if (!conn) {
        missing.push(`${req.from} → ${req.to}`);
      } else if (conn.cableId !== req.cable) {
        wrong.push(`${req.from} → ${req.to} — usou ${conn.cableId}, esperado ${req.cable}`);
      }
    });

    const allDevicesInstalled =
      Object.keys(installedDevices).length === activeLevel.inventory.length;

    if (allDevicesInstalled && missing.length === 0 && wrong.length === 0) {
      playSound("complete");
      setShowSuccess(true);
      successOpacity.setValue(0);
      successScale.setValue(0.6);
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();

      setCompletedLevels((prev) => new Set(prev).add(activeLevel.id));
      if (user?.id) {
        const elapsed = startTime
          ? Math.max(1, Math.round((Date.now() - startTime) / 1000))
          : 0;
        saveDataCenterResult(user.id, activeLevel.id, elapsed, movements, 100).catch(() => {});
      }

      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false);
        });
      }, 1800);
      return;
    }

    playSound("error");
    const items = [
      ...missing.map((m) => `Pendente: ${m}`),
      ...wrong.map((w) => `Incorreto: ${w}`),
      ...(allDevicesInstalled
        ? []
        : ["Nem todos os equipamentos foram instalados no rack."]),
    ];
    setValidationError({
      title: "Validação falhou",
      message: "Revise os pontos abaixo e tente novamente.",
      items,
    });
  }, [
    activeLevel,
    connections,
    installedDevices,
    movements,
    playSound,
    startTime,
    successOpacity,
    successScale,
    user?.id,
  ]);

  // ----------------------------------------------------------------- render
  const renderLevelList = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: bottomPadding + 20,
      }}
    >
      {/* Header - Full Width */}
      <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ hovered }: { hovered?: boolean }) => [
              styles.iconButton,
              { backgroundColor: hovered ? DC_COLORS.bgSurfaceHover : DC_COLORS.bgSurface },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <MaterialIcons name="arrow-back" size={20} color={DC_COLORS.textSecondary} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {data.game.name}
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Simulador profissional de infraestrutura física. Selecione um cenário para começar.
        </Text>
      </View>

      {/* Content - Constrained Width */}
      <View style={[styles.maxContentWidth, { paddingHorizontal: 20, gap: 16 }]}>
        <View style={styles.statsRow}>
          <StatBlock value={String(data.levels.length)} label="Cenários" />
          <StatBlock value={String(completedLevels.size)} label="Concluídos" />
          <StatBlock
            value={
              data.levels.length === 0
                ? "0%"
                : `${Math.round((completedLevels.size / data.levels.length) * 100)}%`
            }
            label="Progresso"
          />
        </View>

        <View style={styles.levelGrid}>
          {data.levels.map((lvl) => (
            <LevelCard
              key={lvl.id}
              level={lvl}
              completed={completedLevels.has(lvl.id)}
              onPress={() => handleLevelSelect(lvl)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderWorkbench = () => {
    if (!activeLevel) return null;
    // Extra bottom padding while the soft keyboard is open, so the laptop
    // (which sits at the bottom in stacked layout) can be scrolled above it.
    const extraBottom = consoleFocused
      ? Platform.OS === "web"
        ? 360 // web mobile: reserve room; viewport is already smaller
        : keyboardHeight + 40
      : 0;

    // Informational overlays — "Instalar", "Regras", "Legenda". In desktop
    // these sit inline on the toolbar; in mobile they collapse into a
    // floating action button (see WorkbenchFab below).
    const helpActions = [
      {
        id: "install",
        icon: "build" as const,
        label: "Instalar",
        onPress: () => setShowInstallHelp(true),
      },
      {
        id: "rules",
        icon: "rule" as const,
        label: "Regras",
        onPress: () => setShowGuidelines(true),
      },
      {
        id: "legend",
        icon: "info-outline" as const,
        label: "Legenda",
        onPress: () => setShowLegend(true),
      },
    ];

    return (
      <View style={{ flex: 1 }}>
      <ScrollView
        ref={workbenchScrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        contentContainerStyle={{
          padding: 16,
          paddingTop: topPadding + 16,
          paddingBottom: bottomPadding + 20 + extraBottom,
          gap: 12,
          maxWidth: 1400,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={styles.wbHeader}>
          <Pressable
            onPress={() => setConfirmExitOpen(true)}
            style={({ hovered }: { hovered?: boolean }) => [
              styles.iconButton,
              { backgroundColor: hovered ? DC_COLORS.bgSurfaceHover : DC_COLORS.bgSurface },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a lista de cenários"
          >
            <MaterialIcons name="arrow-back" size={20} color={DC_COLORS.textSecondary} />
          </Pressable>
          <View style={{ flex: 1, minWidth: 0 }}>
            {activeLevel.tier ? (
              <Text style={styles.wbTier} numberOfLines={1}>
                {activeLevel.tier}
              </Text>
            ) : null}
            <Text style={styles.wbTitle} numberOfLines={1}>
              {activeLevel.name}
            </Text>
          </View>
          <View style={styles.metricsWrap}>
            <MetricChip icon="swap-horiz" label={`${movements}`} title="Movimentos" />
            <MetricChip
              icon="cable"
              label={`${connections.length}/${activeLevel.connections_required.length}`}
              title="Conexões"
            />
          </View>
        </View>

        <View
          style={[styles.canvasSurface, styles.maxContentWidth]}
          onLayout={(e) => {
            canvasSurfaceYRef.current = e.nativeEvent.layout.y;
          }}
        >
          <WorkbenchCanvas
            level={activeLevel}
            inventory={activeLevel.inventory}
            installedDevices={installedDevices}
            connections={connections}
            cableTypes={data.cable_types ?? []}
            ledOn={ledOn}
            portStatus={portStatus}
            sourceNode={sourceNode}
            consoleDevice={consoleDevice}
            consoleManualCompletedTokens={
              consoleDevice
                ? completedCliTokensByDevice[consoleDevice.id] ?? EMPTY_TOKEN_SET
                : EMPTY_TOKEN_SET
            }
            consoleManualCollapsed={manualCollapsed}
            onConsoleManualToggle={() => setManualCollapsed((v) => !v)}
            mobileView={mobileView}
            onMobileViewChange={setMobileView}
            onSlotPress={(slot) => setSelectedSlotForInstall(slot)}
            onUninstall={handleUninstall}
            onPortPress={handlePortPress}
            onLaptopSerialPress={handleLaptopSerialPress}
            onConsoleClose={() => {
              setConsoleDevice(null);
              setConnections((conns) => conns.filter((c) => c.cableId !== "console"));
            }}
            onConsoleInputFocusChange={handleConsoleInputFocusChange}
            onConsoleSectionCompleted={handleConsoleSectionCompleted}
          />
        </View>
      </ScrollView>

      {/* Unified Toolbar for Web & Mobile */}
      <View style={[styles.toolbarDock, { bottom: 16 + bottomPadding }]}>
        <WorkbenchToolbar
          actions={[
            ...helpActions,
            {
              id: "validate",
              icon: "check",
              label: "Validar",
              variant: "success",
              onPress: handleValidate,
            },
          ]}
          compact={windowWidth < DC_BREAKPOINTS.compactChrome}
        />
      </View>
    </View>
    );
  };

  // ------------------------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: DC_COLORS.bgPage }}>
      {!activeLevel ? renderLevelList() : renderWorkbench()}

      {/* Success overlay */}
      {showSuccess && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.successOverlay, { opacity: successOpacity }]}
        >
          <Animated.View
            style={[styles.successCard, { transform: [{ scale: successScale }] }]}
          >
            <MaterialIcons name="check-circle" size={72} color={DC_COLORS.success} />
            <Text style={styles.successTitle}>HOMOLOGADO</Text>
            <Text style={styles.successSubtitle}>Cenário validado com sucesso.</Text>
          </Animated.View>
        </Animated.View>
      )}

      {/* Validation */}
      <DcModal
        visible={validationError !== null}
        onClose={() => setValidationError(null)}
        title={validationError?.title ?? ""}
        subtitle={validationError?.message}
        icon="error-outline"
        tone="danger"
        primaryAction={{ label: "Revisar", onPress: () => setValidationError(null) }}
      >
        {validationError?.items?.length
          ? validationError.items.map((item, i) => (
              <View key={i} style={styles.errorRow}>
                <MaterialIcons
                  name="chevron-right"
                  size={14}
                  color={DC_COLORS.danger}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.errorText}>{item}</Text>
              </View>
            ))
          : null}
      </DcModal>

      {/* Install picker */}
      <DcModal
        visible={selectedSlotForInstall !== null}
        onClose={() => setSelectedSlotForInstall(null)}
        title="Alocar equipamento"
        subtitle={
          selectedSlotForInstall !== null && activeLevel
            ? `Slot ${activeLevel.inventory.length - selectedSlotForInstall}U — escolha o item`
            : undefined
        }
        icon="inventory-2"
        secondaryAction={{
          label: "Cancelar",
          onPress: () => setSelectedSlotForInstall(null),
        }}
      >
        <View style={styles.invGrid}>
          {activeLevel?.inventory.map((d, i) => {
            const alreadyInstalled = Object.values(installedDevices).some((x) => x.id === d.id);
            const iconName = getDeviceIcon(d.id, d.type);
            return (
              <Pressable
                key={`${d.id}-${i}`}
                disabled={alreadyInstalled}
                onPress={() => !alreadyInstalled && handleInstallItem(d)}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed && !alreadyInstalled ? 0.98 : 1 }] }
                ]}
                accessibilityRole="button"
                accessibilityState={{ disabled: alreadyInstalled }}
                accessibilityLabel={`Instalar ${d.label ?? d.id}`}
              >
                <View style={[
                  styles.invItem,
                  {
                    backgroundColor: DC_COLORS.bgSurface,
                    opacity: alreadyInstalled ? 0.35 : 1,
                  },
                ]}>
                  <View style={styles.invIconWrap}>
                    <MaterialCommunityIcons
                      name={iconName as any}
                      size={26}
                      color={DC_COLORS.accentSoft}
                    />
                  </View>
                  <Text style={styles.invName} numberOfLines={2}>
                    {d.label ?? d.id}
                  </Text>
                  <Text style={styles.invType} numberOfLines={1}>
                    {d.type}
                  </Text>
                  {alreadyInstalled && (
                    <View style={styles.invBadge}>
                      <MaterialIcons name="check" size={12} color={DC_COLORS.success} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </DcModal>

      {/* Cable picker */}
      <DcModal
        visible={showCableMenu}
        onClose={() => {
          setShowCableMenu(false);
          setSourceNode(null);
          setSelectedCable(null);
        }}
        title="Selecionar cabo"
        subtitle="Escolha o tipo de cabo correto para esta conexão."
        icon="cable"
        secondaryAction={{
          label: "Cancelar",
          onPress: () => {
            setShowCableMenu(false);
            setSourceNode(null);
            setSelectedCable(null);
          },
        }}
      >
        {(data.cable_types ?? []).map((c) => {
          const visual = getCableVisual(c);
          return (
            <Pressable
              key={c.id}
              onPress={() => {
                setSelectedCable(c);
                setShowCableMenu(false);
                // Mobile/stacked shortcut: the laptop isn't visible on screen
                // while the rack is active, so auto-wire the console cable to
                // laptop.console as soon as the user picks it.
                if (c.id === "console" && isStackedCanvas) {
                  tryAutoConnectConsoleToLaptop();
                }
              }}
              style={({ hovered }: { hovered?: boolean }) => [
                styles.cableItem,
                {
                  backgroundColor: hovered ? DC_COLORS.bgSurfaceHover : DC_COLORS.bgSurface,
                  borderColor: hovered ? `${visual.color}66` : DC_COLORS.borderSubtle,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar cabo ${visual.label}`}
            >
              <View style={[styles.cableDot, { backgroundColor: visual.color }]} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cableName}>{visual.label}</Text>
                <Text style={styles.cableDesc} numberOfLines={2}>
                  {c.speed ? `${c.speed} · ` : ""}
                  {visual.description}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={DC_COLORS.textMuted} />
            </Pressable>
          );
        })}
      </DcModal>

      {/* Legend */}
      <DcModal
        visible={showLegend}
        onClose={() => setShowLegend(false)}
        title="Legenda de cabos"
        subtitle="Cores padrão utilizadas no diagrama."
        icon="info-outline"
        primaryAction={{ label: "Fechar", onPress: () => setShowLegend(false) }}
      >
        {Object.entries(DC_CABLE_VISUALS).map(([id, v]) => (
          <View key={id} style={styles.legendRow}>
            <View style={[styles.cableDot, { backgroundColor: v.color }]} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.cableName}>{v.label}</Text>
              <Text style={styles.cableDesc}>{v.description}</Text>
            </View>
          </View>
        ))}
      </DcModal>

      {/* Guidelines */}
      <DcModal
        visible={showGuidelines}
        onClose={() => setShowGuidelines(false)}
        title="Regras do cenário"
        subtitle={activeLevel?.description}
        icon="rule"
        primaryAction={{ label: "Fechar", onPress: () => setShowGuidelines(false) }}
      >
        {(activeLevel?.rules ?? []).length > 0 ? (
          (activeLevel?.rules ?? []).map((r, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{r}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.modalBody}>Nenhuma regra adicional para este cenário.</Text>
        )}
      </DcModal>

      {/* Install help */}
      <DcModal
        visible={showInstallHelp}
        onClose={() => setShowInstallHelp(false)}
        title="Como instalar"
        subtitle="Siga os passos abaixo para completar o cenário."
        icon="build"
        primaryAction={{ label: "Entendi", onPress: () => setShowInstallHelp(false) }}
      >
        {[
          "Clique em um slot vazio (U) do rack para selecionar onde instalar.",
          "Escolha o equipamento correspondente na lista apresentada.",
          "Com todos os equipamentos no rack, clique em uma porta para iniciar um cabo.",
          "Escolha o tipo de cabo e clique na porta de destino.",
          "Use o cabo de console entre o notebook e a porta CONSOLE do equipamento para gerenciar via terminal.",
          "Clique em Validar quando todas as conexões do cenário estiverem completas.",
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </DcModal>

      {/* Confirm exit — intercepts the workbench back button so the user
          doesn't accidentally lose an in-progress level. */}
      <ConfirmExitModal
        visible={confirmExitOpen}
        onCancel={() => {
          setConfirmExitOpen(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          setConfirmExitOpen(false);
          isExitingRef.current = true;
          if (pendingAction) {
            navigation.dispatch(pendingAction);
          } else {
            handleLeaveLevel();
          }
        }}
        title="Sair do cenário?"
        message="Seu progresso neste cenário (instalações, cabos e sessão do console) será descartado. Deseja realmente sair?"
        confirmLabel="Sair do cenário"
        cancelLabel="Continuar"
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Presentational helpers (kept local to avoid premature abstraction)
// ---------------------------------------------------------------------------
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MetricChip({
  icon,
  label,
  title,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  title: string;
}) {
  return (
    <View style={styles.metricChip} accessibilityLabel={`${title}: ${label}`}>
      <MaterialIcons name={icon} size={14} color={DC_COLORS.textMuted} />
      <Text style={styles.metricValue}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  levelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: DC_RADII.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
  },
  title: {
    color: DC_COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: DC_COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  statBlock: {
    flexGrow: 1,
    flexBasis: 120,
    backgroundColor: DC_COLORS.bgPanel,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    borderRadius: DC_RADII.lg,
    padding: 14,
  },
  statValue: {
    color: DC_COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  statLabel: {
    color: DC_COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  wbHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wbTier: {
    color: DC_COLORS.accentSoft,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wbTitle: {
    color: DC_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  metricsWrap: {
    flexDirection: "row",
    gap: 6,
  },
  metricChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: DC_RADII.pill,
    backgroundColor: DC_COLORS.bgSurface,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
  },
  metricValue: {
    color: DC_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "800",
  },
  canvasSurface: {
    backgroundColor: DC_COLORS.bgPanelInset,
    borderRadius: DC_RADII.lg,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    padding: 8,
  },
  successOverlay: {
    backgroundColor: "rgba(2,4,8,0.88)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  successCard: {
    alignItems: "center",
    gap: 12,
    padding: 32,
    borderRadius: DC_RADII.xl,
    backgroundColor: DC_COLORS.bgPanel,
    borderWidth: 1,
    borderColor: `${DC_COLORS.success}44`,
    minWidth: 260,
  },
  successTitle: {
    color: DC_COLORS.success,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
  successSubtitle: {
    color: DC_COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  modalBody: {
    color: DC_COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  errorText: {
    color: DC_COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DC_COLORS.accentSoft,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    color: DC_COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${DC_COLORS.accent}1F`,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: DC_COLORS.accentSoft,
    fontSize: 11,
    fontWeight: "900",
  },
  stepText: {
    flex: 1,
    color: DC_COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  invGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  invItem: {
    flexGrow: 1,
    flexBasis: 140,
    padding: 12,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    gap: 6,
    minHeight: 110,
    position: "relative",
  },
  invIconWrap: {
    width: 40,
    height: 40,
    borderRadius: DC_RADII.sm,
    backgroundColor: `${DC_COLORS.accent}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  invName: {
    color: DC_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "800",
  },
  invType: {
    color: DC_COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  invBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(34,197,94,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  cableItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: DC_RADII.sm,
    backgroundColor: DC_COLORS.bgPanelInset,
  },
  cableDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  cableName: {
    color: DC_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "900",
  },
  cableDesc: {
    color: DC_COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  maxContentWidth: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  toolbarDock: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 50,
  },
});
