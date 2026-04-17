import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme, 
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
const AnimatedPath = Animated.createAnimatedComponent(Path);
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { StudyCompletionOverlay } from '../study-session/components/study-completion-overlay';
import { QuizStatCard } from '@/components/quiz/stat-card';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useAuth } from '@/providers/auth-provider';
import { saveDataCenterResult, fetchDataCenterProgress } from '@/lib/api/datacenter';

import RackData from '../coding-practice/Data/datacenterbuild.json';
import { 
  DataCenterData, 
  DataCenterLevel, 
  Cable, 
  ActiveConnection,
  InventoryDevice
} from './datacenter-builder.types';

const { width } = Dimensions.get('window');
const data = RackData as unknown as DataCenterData;

// --- Components ---

type PortProps = {
  portId: string;
  deviceId: string;
  isConnected: boolean;
  isHighlighted: boolean;
  onPress: () => void;
  color: string;
  blinkType: 'success' | 'error' | null;
  blinkAnim: Animated.Value;
  onLayout: (x: number, y: number) => void;
};

const Port = ({ portId, deviceId, isConnected, isHighlighted, onPress, color, blinkType, blinkAnim, onLayout }: PortProps) => {
  const blinkColor = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', blinkType === 'success' ? '#22C55E88' : '#EF444488']
  });

  return (
    <View 
      onLayout={(e) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        onLayout(x + width / 2, y + height / 2);
      }}
      style={{ position: 'relative' }}
    >
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        onLayout={(e) => {
          // This onLayout is easier to get center
          // But it's relative to parent.
        }}
        style={[
          styles.port, 
          { borderColor: isHighlighted ? '#F59E0B' : (isConnected ? '#22C55E' : 'rgba(255,255,255,0.2)') },
          isHighlighted && { backgroundColor: 'rgba(245,158,11,0.2)' },
          isConnected && { backgroundColor: 'rgba(34,197,94,0.1)' }
        ]}
      >
        {blinkType && <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: blinkColor, borderRadius: 4, zIndex: 5 }]} />}
        <View style={[styles.portHole, { backgroundColor: isConnected ? color : '#111' }]} />
        <Text style={styles.portLabel}>{portId.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
};

type DeviceRowProps = {
  device: InventoryDevice;
  connections: ActiveConnection[];
  selectedPort: { deviceId: string; port: string } | null;
  onPortPress: (deviceId: string, port: string) => void;
  cables: Cable[];
  blinkingPorts: Record<string, 'success' | 'error'>;
  blinkAnim: Animated.Value;
  isPoweredOn: boolean;
  diagnosisActive: boolean;
  requiredConnections: any[];
  expectedDeviceId: string;
  onPortLayout: (portKey: string, x: number, y: number) => void;
};

const getDeviceIcon = (deviceId: string, type: string) => {
  const idLower = deviceId.toLowerCase();
  
  if (idLower.includes('modem') || idLower.includes('isp')) return 'modem';
  if (idLower.includes('router')) return 'router-wireless';
  if (idLower.includes('switch')) return 'switch';
  if (idLower.includes('firewall')) return 'shield-lock';
  if (idLower.includes('storage')) return 'database';
  if (idLower.includes('camera')) return 'video-outline';
  if (idLower.includes('voip')) return 'phone-voip';
  if (idLower.includes('load_balancer')) return 'transit-connection-variant';
  
  // Fallback by type
  switch (type) {
    case 'telecom': return 'modem';
    case 'network': return 'router';
    case 'security': return 'security';
    case 'storage': return 'database';
    case 'compute': return 'server';
    default: return 'server';
  }
};

const DeviceRow = ({ 
  device, 
  connections, 
  selectedPort, 
  onPortPress, 
  cables, 
  blinkingPorts, 
  blinkAnim, 
  isPoweredOn,
  diagnosisActive,
  requiredConnections,
  expectedDeviceId,
  onPortLayout
}: DeviceRowProps) => {
  const [portsOffsetY, setPortsOffsetY] = useState(0);

  const getPortColor = (portId: string) => {
    const conn = connections.find(c => 
      (c.from.deviceId === device.id && c.from.port === portId) || 
      (c.to?.deviceId === device.id && c.to?.port === portId)
    );
    if (!conn) return '#555';
    const cable = cables.find(cb => cb.id === conn.cableId);
    return cable?.type === 'fiber' ? '#F43F5E' : (cable?.type === 'ethernet' ? '#3B82F6' : '#F59E0B');
  };

  const getDiagnostics = () => {
    if (!diagnosisActive && !isPoweredOn) return 'off';
    
    // Check if the hardware itself is correct for this slot
    if (device.id !== expectedDeviceId) return 'red';

    // Check required connections involving this device
    const reqs = requiredConnections.filter(r => r.from.startsWith(device.id) || r.to.startsWith(device.id));
    if (reqs.length === 0) return isPoweredOn ? 'green' : 'off';

    const metReqs = reqs.filter(req => {
      return connections.some(conn => {
        const cFrom = `${conn.from.deviceId}.${conn.from.port}`;
        const cTo = `${conn.to?.deviceId}.${conn.to?.port}`;
        return ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === conn.cableId;
      });
    });

    // Check if there are "extra" or wrong connections on this device
    const deviceConns = connections.filter(c => c.from.deviceId === device.id || c.to?.deviceId === device.id);
    const hasErrorConnection = deviceConns.some(conn => {
      const cFrom = `${conn.from.deviceId}.${conn.from.port}`;
      const cTo = `${conn.to?.deviceId}.${conn.to?.port}`;
      return !requiredConnections.some(req => 
        ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === conn.cableId
      );
    });

    if (metReqs.length === reqs.length && !hasErrorConnection) return 'green';
    if (metReqs.length > 0 || deviceConns.length > 0) return 'orange';
    return 'red';
  };

  const diag = getDiagnostics();

  return (
    <View 
      style={styles.deviceRow}
      onLayout={(e) => {
        // We could report Row Y here, but better in the screen loop
      }}
    >
      <View style={styles.deviceHandle}><View style={styles.handleGrip}/></View>
      <View style={styles.devicePanel}>
        <View style={styles.deviceBrushedEffect} />
        <View 
          style={styles.deviceHeader}
          onLayout={(e) => {
            // Header height + margin affects ports Y
            setPortsOffsetY(e.nativeEvent.layout.height + 8); 
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name={getDeviceIcon(device.id, device.type) as any} size={14} color="#71717A" />
            <Text style={styles.deviceName}>{device.id.toUpperCase()}</Text>
          </View>
          <View style={styles.ledsContainer}>
            <Animated.View style={[
              styles.led, 
              diag === 'green' && styles.ledActiveGreen,
              diag === 'orange' && { 
                backgroundColor: '#F59E0B',
                opacity: diag === 'orange' ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) : 1
              },
              diag === 'red' && {
                backgroundColor: '#EF4444',
                opacity: diag === 'red' ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) : 1
              }
            ]} />
             <Animated.View style={[
              styles.led, 
              diag === 'green' && styles.ledActiveGreen,
              diag === 'orange' && { 
                backgroundColor: '#F59E0B',
                opacity: diag === 'orange' ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) : 1
              },
              diag === 'red' && {
                backgroundColor: '#EF4444',
                opacity: diag === 'red' ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) : 1
              }
            ]} />
            <View style={styles.led} />
          </View>
        </View>
        <View style={styles.portsContainer}>
          {device.ports.map(port => {
            const isSelected = selectedPort?.deviceId === device.id && selectedPort?.port === port;
            const isConnected = connections.some(c => 
              (c.from.deviceId === device.id && c.from.port === port) || 
              (c.to?.deviceId === device.id && c.to?.port === port)
            );
            return (
              <Port 
                key={port}
                portId={port}
                deviceId={device.id}
                isConnected={isConnected}
                isHighlighted={isSelected}
                onPress={() => onPortPress(device.id, port)}
                color={getPortColor(port)}
                blinkType={blinkingPorts?.[`${device.id}.${port}`] || null}
                blinkAnim={blinkAnim}
                onLayout={(x, y) => onPortLayout(`${device.id}.${port}`, x, y + portsOffsetY)}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.deviceHandle}><View style={styles.handleGrip}/></View>
    </View>
  );
};

// --- Main Screen ---

export function DataCenterBuilderScreen() {
  const isDark = useColorScheme() === 'dark';
  const topPadding = useTopContentPadding();
  const bottomPadding = useTabContentPadding();

  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<DataCenterLevel | null>(null);
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null);
  const [sourceNode, setSourceNode] = useState<{ deviceId: string; port: string } | null>(null);
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [movements, setMovements] = useState(0);
  
  // Game Flow States
  const [installedDevices, setInstalledDevices] = useState<Record<number, InventoryDevice>>({});
  const [inventory, setInventory] = useState<InventoryDevice[]>([]);
  const [blinkSlot, setBlinkSlot] = useState<{ index: number, type: 'success' | 'error' } | null>(null);
  const [blinkingInventoryItem, setBlinkingInventoryItem] = useState<string | null>(null);
  const [blinkingPorts, setBlinkingPorts] = useState<Record<string, 'success' | 'error'>>({});
  const [selectedSlotForInstall, setSelectedSlotForInstall] = useState<number | null>(null);
  const [showCableMenu, setShowCableMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccessTransition, setShowSuccessTransition] = useState(false);
  const [levelFilter, setLevelFilter] = useState<'TODOS' | 'EASY' | 'MEDIUM' | 'HARD'>('TODOS');
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [diagnosisActive, setDiagnosisActive] = useState(false);
  const [portPositions, setPortPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [rowPositions, setRowPositions] = useState<Record<number, number>>({});
  
  const rackRef = useRef<View>(null);

  const blinkAnim = useRef(new Animated.Value(0)).current;

  const playSound = async (type: 'success' | 'complete' | 'error') => {
    try {
      const soundFile = type === 'complete' ? require('@/assets/songs/concluido.mp3') : 
                        type === 'success' ? require('@/assets/songs/acertou.mp3') : 
                        require('@/assets/songs/erro.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  };

  // Visual Assets for Completion
  const completionRingScale = useRef(new Animated.Value(0.8)).current;
  const completionRingOpacity = useRef(new Animated.Value(0)).current;
  const completionBgOpacity = useRef(new Animated.Value(0)).current;
  const completionIconScale = useRef(new Animated.Value(0.5)).current;
  const completionTextOpacity = useRef(new Animated.Value(0)).current;

  const bg = isDark ? '#0D0F10' : '#F8FAFC';
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textMuted = isDark ? '#9BA1A6' : '#687076';
  const surfaceColor = isDark ? '#1A1D21' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const isHardwareInstalled = useMemo(() => {
    if (!activeLevel) return false;
    return Object.keys(installedDevices).length === activeLevel.inventory.length;
  }, [installedDevices, activeLevel]);

  useEffect(() => {
    if (user?.id) {
       fetchDataCenterProgress(user.id).then(results => {
          const done = new Set<number>();
          Object.keys(results).forEach(id => {
             if (results[id].completed) done.add(parseInt(id));
          });
          setCompletedLevels(done);
       });
    }
  }, [user]);

  const handleLevelSelect = (level: DataCenterLevel) => {
    setActiveLevel(level);
    setConnections([]);
    setSourceNode(null);
    setSelectedCable(null);
    setInstalledDevices({});
    setInventory([...level.inventory]);
    setStartTime(Date.now());
    setFinished(false);
    setMovements(0);
  };

  const triggerBlinkSlot = (slotIndex: number, type: 'success' | 'error') => {
    setBlinkSlot({ index: slotIndex, type });
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
    ]).start(() => setBlinkSlot(null));
  };

  const triggerBlinkInventoryItem = (deviceId: string) => {
    setBlinkingInventoryItem(deviceId);
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
    ]).start(() => setBlinkingInventoryItem(null));
  };

  const triggerBlinkPort = (portKey1: string, portKey2: string, type: 'success' | 'error') => {
    setBlinkingPorts({ [portKey1]: type, [portKey2]: type });
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start(() => setBlinkingPorts({}));
  };

  const handleInstallItem = (device: InventoryDevice) => {
    if (selectedSlotForInstall === null || !activeLevel) return;

    setInstalledDevices(prev => ({ ...prev, [selectedSlotForInstall]: device }));
    setInventory(prev => prev.filter(d => d.id !== device.id));
    setMovements(m => m + 1);
    setSelectedSlotForInstall(null);
  };

  const handlePortPress = (deviceId: string, port: string) => {
    if (!isHardwareInstalled) return;

    const existing = connections.find(c => (c.from.deviceId === deviceId && c.from.port === port) || (c.to?.deviceId === deviceId && c.to?.port === port));
    
    if (existing) {
      removeConnection(deviceId, port);
      return;
    }

    if (!sourceNode) {
      setSourceNode({ deviceId, port });
      setShowCableMenu(true);
    } else {
      if (sourceNode.deviceId === deviceId && sourceNode.port === port) {
        setSourceNode(null);
        setSelectedCable(null);
        return;
      }

      if (!selectedCable) {
        setSourceNode(null);
        return;
      }

      validateConnectionAttempt(sourceNode, { deviceId, port }, selectedCable);
    }
  };

  const validateConnectionAttempt = (from: { deviceId: string; port: string }, to: { deviceId: string; port: string }, cable: Cable) => {
    if (!activeLevel) return;

    const fromKey = `${from.deviceId}.${from.port}`;
    const toKey = `${to.deviceId}.${to.port}`;

    // Now allowing any connection for trial-and-error gameplay
    const newConn: ActiveConnection = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      cableId: cable.id
    };
    
    setConnections([...connections, newConn]);
    triggerBlinkPort(fromKey, toKey, 'success');
    setSourceNode(null);
    setSelectedCable(null);
    setMovements(m => m + 1);
    setDiagnosisActive(false); // Reset diagnosis on change
  };

  const removeConnection = (deviceId: string, port: string) => {
    setConnections(connections.filter(c => 
      !(c.from.deviceId === deviceId && c.from.port === port) &&
      !(c.to?.deviceId === deviceId && c.to?.port === port)
    ));
    setMovements(m => m + 1);
  };

  const handleValidate = () => {
    if (!activeLevel) return;
    setDiagnosisActive(true);

    const isHardwareCorrect = activeLevel.inventory.every((expected, idx) => {
      const installed = installedDevices[idx];
      return installed && installed.id === expected.id;
    });

    const isCablingCorrect = activeLevel.connections_required.every(req => {
      return connections.some(conn => {
        const cFrom = `${conn.from.deviceId}.${conn.from.port}`;
        const cTo = `${conn.to?.deviceId}.${conn.to?.port}`;
        return ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === conn.cableId;
      });
    }) && connections.length === activeLevel.connections_required.length;

    if (isHardwareCorrect && isCablingCorrect) {
      setIsSyncing(true);
      playSound('complete');
      setShowSuccessTransition(true);

      // Reset and Start Animation
      successScale.setValue(0);
      successOpacity.setValue(1);
      
      Animated.timing(successScale, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessTransition(false);
          setFinished(true);
          setIsSyncing(false);
          
          const now = Date.now();
          const timeSecs = startTime ? Math.floor((now - startTime) / 1000) : 0;
          setElapsedTime(timeSecs);
          setCompletedLevels(new Set([...completedLevels, activeLevel.id]));
          if (user?.id) {
             saveDataCenterResult(user.id, activeLevel.id, timeSecs, movements);
          }
        });
      }, 3000);
    } else {
      playSound('error');
      // Diagnostic blink sequence
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 400, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start();
      
      Alert.alert("Arquitetura Incompleta", "Verifique os LEDs diagnósticos que estão piscando em vermelho/laranja.");
    }
  };

  const renderLevelList = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding + 20, paddingBottom: bottomPadding + 20, paddingHorizontal: 20 }}
    >
      <View style={{ marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textPrimary }]}>{data.game.name}</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>Simulador de montagem e cabeamento estruturado.</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }} contentContainerStyle={{ gap: 8 }}>
        {['TODOS', 'EASY', 'MEDIUM', 'HARD'].map((filter) => {
          const isActive = levelFilter === filter;
          const filterColor = filter === 'EASY' ? '#22C55E' : filter === 'MEDIUM' ? '#F59E0B' : filter === 'HARD' ? '#EF4444' : '#3B82F6';
          return (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setLevelFilter(filter as any)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: isActive ? filterColor : surfaceColor,
                borderWidth: 1.5,
                borderColor: isActive ? filterColor : borderColor,
              }}
            >
              <Text style={{ color: isActive ? '#FFFFFF' : textMuted, fontWeight: '800', fontSize: 13 }}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <View style={styles.levelGrid}>
        {data.levels.filter(lvl => levelFilter === 'TODOS' || lvl.difficulty.toUpperCase() === levelFilter).map(lvl => {
          const isDone = completedLevels.has(lvl.id);
          return (
            <TouchableOpacity 
              key={lvl.id} 
              style={[styles.levelCard, { backgroundColor: surfaceColor, borderColor: isDone ? '#10B98150' : '#2D3139' }]}
              onPress={() => handleLevelSelect(lvl)}
            >
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>{lvl.id}</Text>
              </View>
              <Text style={[styles.levelName, { color: textPrimary }]} numberOfLines={2}>{lvl.name}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: lvl.difficulty === 'easy' ? '#22C55E20' : (lvl.difficulty === 'medium' ? '#F59E0B20' : '#EF444420') }]}>
                <Text style={[styles.difficultyText, { color: lvl.difficulty === 'easy' ? '#22C55E' : (lvl.difficulty === 'medium' ? '#F59E0B' : '#EF4444') }]}>
                  {lvl.difficulty.toUpperCase()}
                </Text>
              </View>
              {isDone && <MaterialIcons name="check-circle" size={24} color="#10B981" style={styles.doneIcon} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderWorkbench = () => {
    if (!activeLevel) return null;

    // Standardized results handling
    const renderHeader = () => (
      <View style={[styles.workbenchHeader, { paddingTop: topPadding + 10, backgroundColor: surfaceColor, borderBottomWidth: 1, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => setActiveLevel(null)} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.workbenchTitle, { color: textPrimary }]}>RESULTADOS</Text>
        <View style={{ width: 40 }} />
      </View>
    );

    if (finished) {
      return (
        <View style={{ flex: 1, backgroundColor: bg }}>
          {renderHeader()}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <MaterialIcons name="emoji-events" size={80} color={QUIZ_COLORS.success} />
              <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, marginTop: 16 }}>PROJETO VALIDADO!</Text>
              <Text style={{ color: textMuted, marginTop: 8, textAlign: 'center' }}>
                O DataCenter está operando em conformidade técnica.
              </Text>
            </View>
            
            <View style={{ width: '100%', maxWidth: 300, gap: 12 }}>
              <TouchableOpacity
                onPress={() => setActiveLevel(null)}
                style={{ 
                  backgroundColor: QUIZ_COLORS.success, 
                  padding: 16, borderRadius: 12, alignItems: 'center' 
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16 }}>CONCLUIR PROJETO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLevelSelect(activeLevel)}
                style={{ 
                  backgroundColor: surfaceColor, 
                  padding: 16, borderRadius: 12, alignItems: 'center',
                  borderWidth: 1, borderColor: borderColor
                }}
              >
                <Text style={{ color: textPrimary, fontWeight: '700' }}>REFAZER NÍVEL</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#050505' }}>
        <View style={[styles.workbenchHeader, { paddingTop: topPadding + 10 }]}>
          <TouchableOpacity onPress={() => setActiveLevel(null)} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#ECEDEE" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.workbenchLevelName}>{activeLevel.name}</Text>
            <Text style={styles.workbenchStatus}>
              {isHardwareInstalled ? 'Fase 2: Conectar Portas' : 'Fase 1: Instalação de Hardware'}
            </Text>
          </View>
          {isHardwareInstalled && (
            <TouchableOpacity onPress={handleValidate} disabled={isSyncing} style={[styles.validateButton, { backgroundColor: connections.length === activeLevel.connections_required.length ? '#22C55E' : '#2D3139', opacity: isSyncing ? 0.6 : 1 }]}>
              <Text style={styles.validateButtonText}>{isSyncing ? 'SINCRONIZANDO...' : 'VALIDAR'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={{ flex: 1, paddingTop: 10 }} contentContainerStyle={{ padding: 15, paddingBottom: bottomPadding + 100 }}>
          <View style={styles.rackContainer} ref={rackRef}>
            <View style={styles.rackRailLeft}>
               {[1,2,3,4,5,6,7,8].map(i => <View key={i} style={styles.railHole} />)}
            </View>
            <View style={styles.rackMain}>
              {activeLevel.inventory.map((expectedDevice, index) => {
                const installed = installedDevices[index];
                const isBlinkingS = blinkSlot?.index === index;
                const slotColor = blinkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['transparent', blinkSlot?.type === 'success' ? '#22C55E88' : '#EF444488']
                });
                const uNum = activeLevel.inventory.length - index;

                return (
                  <View 
                    key={index} 
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onLayout={(e) => {
                      const { y } = e.nativeEvent.layout;
                      setRowPositions(prev => ({ ...prev, [index]: y }));
                    }}
                  >
                    <Text style={styles.uLabel}>{uNum}U</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (installed) {
                          setInventory(prev => [...prev, installed]);
                          const newInstalled = { ...installedDevices };
                          delete newInstalled[index];
                          setInstalledDevices(newInstalled);
                          setMovements(m => m + 1);
                          setDiagnosisActive(false);
                        } else {
                          setSelectedSlotForInstall(index);
                        }
                      }}
                      style={[styles.rackSlot, !installed && styles.emptySlot, { flex: 1 }]}
                    >
                      {isBlinkingS && <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: slotColor, borderRadius: 4, zIndex: 1 }]} />}
                      {installed ? (
                        <DeviceRow 
                          device={installed} 
                          connections={connections} 
                          selectedPort={sourceNode} 
                          onPortPress={handlePortPress} 
                          cables={data.cables} 
                          blinkingPorts={blinkingPorts} 
                          blinkAnim={blinkAnim}
                          isPoweredOn={finished}
                          diagnosisActive={diagnosisActive}
                          requiredConnections={activeLevel.connections_required}
                          expectedDeviceId={expectedDevice.id}
                          onPortLayout={(fullPortKey, relX, relY) => {
                             const rY = rowPositions[index] || 0;
                             setPortPositions(prev => ({
                               ...prev,
                               [fullPortKey]: { x: relX + 28 + 14 + 14, y: relY + rY + 42 }
                             }));
                          }}
                        />
                      ) : (
                        <View style={styles.slotEmptyContent}>
                          <MaterialIcons name="add-box" size={20} color="#222" />
                          <Text style={styles.slotEmptyText}>{uNum} U</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <View style={styles.rackRailRight}>
               {[1,2,3,4,5,6,7,8].map(i => <View key={i} style={styles.railHole} />)}
            </View>

             {/* Cable Rendering Layer */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Svg width="100%" height="100%">
                {connections.map(conn => {
                  const p1 = portPositions[`${conn.from.deviceId}.${conn.from.port}`];
                  const p2 = portPositions[`${conn.to?.deviceId}.${conn.to?.port}`];
                  
                  if (!p1 || !p2) return null;

                  const cable = data.cables.find(c => c.id === conn.cableId);
                  const color = cable?.type === 'fiber' ? '#F43F5E' : (cable?.type === 'ethernet' ? '#3B82F6' : '#F59E0B');

                  // Check if this specific connection is correct
                  const isCorrect = activeLevel.connections_required.some(req => {
                    const cFrom = `${conn.from.deviceId}.${conn.from.port}`;
                    const cTo = `${conn.to?.deviceId}.${conn.to?.port}`;
                    return ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === conn.cableId;
                  });

                  const cableOpacity = diagnosisActive && !isCorrect 
                    ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0.1] }) 
                    : 0.7;

                  // Bezier curve points
                  const curveOffset = 60; // How much it bulges to the right
                  const midY = (p1.y + p2.y) / 2;

                  return (
                    <React.Fragment key={conn.id}>
                      {/* Cable Path with rightward curve */}
                      <AnimatedPath
                        d={`M ${p1.x} ${p1.y} C ${p1.x + curveOffset} ${p1.y} ${p2.x + curveOffset} ${p2.y} ${p2.x} ${p2.y}`}
                        stroke={color}
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        opacity={cableOpacity}
                      />
                      {/* Start Connector - Higher contrast */}
                      <AnimatedPath
                        d={`M ${p1.x - 5} ${p1.y - 4} h 10 v 8 h -10 z`}
                        fill={color}
                        opacity={diagnosisActive && !isCorrect ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) : 1}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                      />
                      {/* End Connector - Higher contrast */}
                      <AnimatedPath
                        d={`M ${p2.x - 5} ${p2.y - 4} h 10 v 8 h -10 z`}
                        fill={color}
                        opacity={diagnosisActive && !isCorrect ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) : 1}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                      />
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          </View>

          <View style={styles.rulesContainer}>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}><MaterialIcons name="info-outline" size={16} color="#9BA1A6" /><Text style={styles.rulesTitle}>DIRETRIZES TÉCNICAS</Text></View>
            {activeLevel.rules ? activeLevel.rules.map((rule, i) => (<Text key={i} style={styles.ruleItem}>• {rule}</Text>)) : (<Text style={styles.ruleItem}>• Realize o cabeamento conforme o diagrama lógico do projeto.</Text>)}
          </View>
        </ScrollView>

        <Modal visible={selectedSlotForInstall !== null} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => setSelectedSlotForInstall(null)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}><Text style={styles.modalTitle}>Escolha o Hardware</Text><Text style={styles.modalSubtitle}>{activeLevel.inventory.length - (selectedSlotForInstall || 0)} U</Text></View>
              <ScrollView style={styles.modalScroll}><View style={styles.inventoryGrid}>
                {inventory.map((device) => {
                  const isBlinkingItem = blinkingInventoryItem === device.id;
                  const itemBlinkColor = blinkAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', '#EF444488']
                  });

                  return (
                    <TouchableOpacity key={device.id} onPress={() => handleInstallItem(device)} style={styles.inventoryItem}>
                      {isBlinkingItem && <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: itemBlinkColor, borderRadius: 16, zIndex: 10 }]} />}
                      <MaterialCommunityIcons name={getDeviceIcon(device.id, device.type) as any} size={28} color="#3B82F6" />
                      <Text style={styles.inventoryItemName}>{device.id.toUpperCase()}</Text>
                      <Text style={styles.inventoryItemType}>{device.type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View></ScrollView>
              <TouchableOpacity onPress={() => setSelectedSlotForInstall(null)} style={styles.modalCloseButton}><Text style={styles.modalCloseText}>CANCELAR</Text></TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <Modal visible={showCableMenu} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => { setShowCableMenu(false); setSourceNode(null); }}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}><Text style={styles.modalTitle}>Selecione o Cabo</Text><Text style={styles.modalSubtitle}>Para conectar {sourceNode?.deviceId}.{sourceNode?.port}</Text></View>
              <ScrollView style={styles.modalScroll}><View style={styles.cableGrid}>
                {data.cables.map((cable) => (
                  <TouchableOpacity key={cable.id} onPress={() => { setSelectedCable(cable); setShowCableMenu(false); }} style={styles.cableMenuItem}>
                    <View style={[styles.cableIconCircle, { backgroundColor: cable.type === 'fiber' ? '#F43F5E20' : (cable.type === 'ethernet' ? '#3B82F620' : '#F59E0B20') }]}><MaterialCommunityIcons name="lan" size={24} color={cable.type === 'fiber' ? '#F43F5E' : (cable.type === 'ethernet' ? '#3B82F6' : '#F59E0B')} /></View>
                    <View style={{ flex: 1 }}><Text style={styles.cableMenuName}>{cable.id.toUpperCase()}</Text><Text style={styles.cableMenuDesc}>{cable.speed} • {cable.type}</Text></View>
                  </TouchableOpacity>
                ))}
              </View></ScrollView>
              <TouchableOpacity onPress={() => { setShowCableMenu(false); setSourceNode(null); }} style={styles.modalCloseButton}><Text style={styles.modalCloseText}>CANCELAR</Text></TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {sourceNode && selectedCable && (
          <View style={styles.floatingIndicator}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><MaterialCommunityIcons name="alert-circle-outline" size={24} color="#000" /><View><Text style={styles.floatingText}>CABO {selectedCable.id.toUpperCase()} ATIVO</Text><Text style={{ color: 'rgba(0,0,0,0.6)', fontSize: 11, fontWeight: '700' }}>Toque na porta de destino</Text></View></View>
            <TouchableOpacity onPress={() => { setSourceNode(null); setSelectedCable(null); }} style={styles.cancelLink}><Text style={styles.cancelLinkText}>ANULAR</Text></TouchableOpacity>
          </View>
        )}

        <StudyCompletionOverlay 
          visible={showCompletionEffect || finished} 
          correctCount={connections.length} 
          totalCards={activeLevel.connections_required.length} 
          backgroundOpacity={completionBgOpacity}
          iconScale={completionIconScale}
          textOpacity={completionTextOpacity}
          ringScale={completionRingScale} 
          ringOpacity={completionRingOpacity} 
          title="DataCenter Online!"
          subtitle={`Projeto concluído em ${Math.floor(elapsedTime / 60)}m`}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {!activeLevel ? renderLevelList() : renderWorkbench()}

      {showSuccessTransition && (
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(13, 15, 16, 0.9)',
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: successOpacity
        }}>
          <Animated.View style={{
            transform: [{ scale: successScale }],
            alignItems: 'center'
          }}>
            <View style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: '#22C55E',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#22C55E',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 40,
              elevation: 20
            }}>
              <MaterialIcons name="check" size={100} color="#FFFFFF" />
            </View>
            <Text style={{ 
              color: '#22C55E', 
              fontSize: 24, 
              fontWeight: '900', 
              marginTop: 32,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>
              Projeto Homologado
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  levelCard: { flexBasis: '48%', flexGrow: 1, padding: 16, borderRadius: 20, borderWidth: 1, position: 'relative' },
  levelBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3B82F620', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  levelNumber: { color: '#3B82F6', fontWeight: '800' },
  levelName: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  difficultyBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  difficultyText: { fontSize: 9, fontWeight: '800' },
  doneIcon: { position: 'absolute', top: 12, right: 12 },
  
  workbenchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1A1D21' },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  workbenchLevelName: { color: '#ECEDEE', fontSize: 15, fontWeight: '800' },
  workbenchStatus: { color: '#9BA1A6', fontSize: 11, fontWeight: '600' },
  validateButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  validateButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },

  rackContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#0A0A0A', 
    borderRadius: 8, 
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20
  },
  rackRailLeft: { 
    width: 28, 
    backgroundColor: '#151515', 
    borderTopLeftRadius: 6, 
    borderBottomLeftRadius: 6, 
    borderRightWidth: 1, 
    borderColor: '#222',
    alignItems: 'center',
    paddingVertical: 4
  },
  rackRailRight: { 
    width: 28, 
    backgroundColor: '#151515', 
    borderTopRightRadius: 6, 
    borderBottomRightRadius: 6, 
    borderLeftWidth: 1, 
    borderColor: '#222',
    alignItems: 'center',
    paddingVertical: 4
  },
  railHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#555',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1
  },
  uLabel: {
    color: '#444',
    fontSize: 9,
    fontWeight: '900',
    position: 'absolute',
    left: 4,
  },
  rackMain: { flex: 1, gap: 4, paddingHorizontal: 2 },
  rackSlot: { minHeight: 85, borderRadius: 2, position: 'relative', overflow: 'hidden' },
  emptySlot: { 
    backgroundColor: '#080808', 
    borderWidth: 1, 
    borderColor: '#111', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5
  },
  slotEmptyContent: { alignItems: 'center', opacity: 0.3 },
  slotEmptyText: { color: '#333', fontSize: 11, fontWeight: '900' },

  deviceRow: { 
    flex: 1,
    backgroundColor: '#18181B', 
    borderRadius: 3, 
    borderWidth: 1, 
    borderColor: '#27272A',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5
  },
  devicePanel: {
    flex: 1,
    backgroundColor: '#1F1F23',
    padding: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#2D2D33',
    position: 'relative'
  },
  deviceBrushedEffect: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.02)',
    opacity: 0.5
  },
  deviceHandle: {
    width: 14,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center'
  },
  handleGrip: {
    width: 4,
    height: '60%',
    backgroundColor: '#222',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333'
  },
  deviceHeader: { 
    paddingHorizontal: 4, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deviceName: { color: '#A1A1AA', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  deviceType: { color: '#71717A', fontSize: 8, textTransform: 'uppercase', fontWeight: '800' },
  ledsContainer: { flexDirection: 'row', gap: 4, marginBottom: 8, paddingHorizontal: 4 },
  led: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#111' },
  ledActiveGreen: { 
    backgroundColor: '#22C55E', 
    shadowColor: '#22C55E', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 1, 
    shadowRadius: 4,
    elevation: 5
  },
  ledActiveOrange: { 
    backgroundColor: '#F59E0B', 
    shadowColor: '#F59E0B', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 1, 
    shadowRadius: 4,
    elevation: 5
  },
  ledActiveRed: { 
    backgroundColor: '#EF4444', 
    shadowColor: '#EF4444', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 1, 
    shadowRadius: 4,
    elevation: 5
  },
  portsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 4 },
  port: { 
    width: 48, 
    height: 34, 
    borderRadius: 2, 
    borderWidth: 1, 
    borderColor: '#2D2D33',
    backgroundColor: '#0F0F12',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 1,
    position: 'relative', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  portInner: {
    width: 6,
    height: 4,
    borderRadius: 1,
    position: 'absolute',
    top: 4,
  },
  portHole: { 
    width: 14, 
    height: 10, 
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#000'
  },
  portLabel: { color: '#4B5563', fontSize: 7, fontWeight: '900', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0D0F10', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: '60%', borderTopWidth: 1, borderTopColor: '#1F1F23' },
  modalHeader: { marginBottom: 32, alignItems: 'center' },
  modalTitle: { color: '#F4F4F5', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  modalSubtitle: { color: '#3B82F6', fontSize: 13, fontWeight: '800', marginTop: 6, textTransform: 'uppercase' },
  modalScroll: { flex: 1 },
  modalCloseButton: { marginTop: 24, paddingVertical: 16, backgroundColor: '#18181B', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },
  modalCloseText: { color: '#A1A1AA', fontWeight: '900', fontSize: 14 },

  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  inventoryItem: { 
    width: 100, 
    height: 120, 
    backgroundColor: '#1E1E22', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    borderWidth: 1, 
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 8
  },
  inventoryItemName: { color: '#F4F4F5', fontSize: 11, fontWeight: '900', textAlign: 'center' },
  inventoryItemType: { color: '#71717A', fontSize: 9, textTransform: 'uppercase', fontWeight: '700' },

  cableGrid: { gap: 14 },
  cableMenuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    backgroundColor: '#18181B', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#27272A' 
  },
  cableIconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  cableMenuName: { color: '#F4F4F5', fontSize: 16, fontWeight: '900' },
  cableMenuDesc: { color: '#71717A', fontSize: 12, fontWeight: '600' },

  rulesContainer: { marginTop: 32, padding: 20, backgroundColor: '#111', borderRadius: 16, borderWidth: 1, borderColor: '#1F1F23' },
  rulesTitle: { color: '#A1A1AA', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  ruleItem: { color: '#52525B', fontSize: 13, marginTop: 8, fontWeight: '600' },

  floatingIndicator: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#F59E0B', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, elevation: 15, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  floatingText: { color: '#000', fontWeight: '900', fontSize: 14 },
  cancelLink: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  cancelLinkText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  successIconOuter: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: `${QUIZ_COLORS.success}40`, backgroundColor: `${QUIZ_COLORS.success}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  concluidoTitle: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  concluidoSubtitle: { fontSize: 15, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  primaryAction: { padding: 18, borderRadius: 18, backgroundColor: QUIZ_COLORS.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: QUIZ_COLORS.success, shadowOpacity: 0.4, shadowRadius: 10 },
  primaryActionText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  secondaryAction: { padding: 18, borderRadius: 18, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#2D3139', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  secondaryActionText: { fontWeight: '900', fontSize: 16 }
});
