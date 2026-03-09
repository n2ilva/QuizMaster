import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// Configura como as notificações aparecem quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const REMINDER_IDS = {
  noon: "study-reminder-noon",
  evening: "study-reminder-evening",
} as const;

const MESSAGES = [
  {
    title: "🔥 Hora de estudar!",
    body: "Mantenha sua sequência de dias consecutivos. Alguns minutos fazem a diferença!",
  },
  {
    title: "📚 Bora manter o ritmo!",
    body: "Que tal responder alguns cards agora? Seu streak agradece!",
  },
  {
    title: "🎯 Não quebre a sequência!",
    body: "Estudar um pouquinho todo dia é o segredo da evolução. Vamos lá!",
  },
  {
    title: "💪 Falta pouco!",
    body: "Responda algumas questões para garantir mais um dia de streak!",
  },
];

function getRandomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

async function scheduleStudyReminders(): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) {
    console.log("[StudyReminders] Permissão de notificação negada");
    return;
  }

  // Cancela notificações anteriores para reagendar
  await Notifications.cancelAllScheduledNotificationsAsync();

  const noonMsg = getRandomMessage();
  const eveningMsg = getRandomMessage();

  // Lembrete das 12h
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.noon,
    content: {
      title: noonMsg.title,
      body: noonMsg.body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  // Lembrete das 18h
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.evening,
    content: {
      title: eveningMsg.title,
      body: eveningMsg.body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });

  console.log("[StudyReminders] Lembretes agendados para 12h e 18h");
}

/**
 * Hook que agenda notificações diárias de lembrete de estudo (12h e 18h).
 * Só funciona em dispositivos nativos (iOS/Android). Na web é ignorado.
 * Deve ser chamado uma vez no layout raiz após o usuário estar logado.
 */
export function useStudyReminders(isLoggedIn: boolean): void {
  useEffect(() => {
    if (!isLoggedIn) return;

    void scheduleStudyReminders();
  }, [isLoggedIn]);
}
