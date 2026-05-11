import { Audio } from "expo-av";
import React, { useRef, useState } from "react";
import { Animated, Easing, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { healingApi, HealingSession } from "../../src/api/healing.api";

const SESSIONS = [
  { type: "breathing",  emoji: "🌬️", label: "Guided Breathing",    desc: "Inhale 4s · Hold 4s · Exhale 4s",  duration: 300, color: "#0284C7", bg: "#E0F2FE" },
  { type: "meditation", emoji: "🧘", label: "Mindfulness Meditation", desc: "Body scan · 5 min silence",       duration: 300, color: "#7C3AED", bg: "#EDE9FE" },
  { type: "music",      emoji: "🎵", label: "Calm Music",           desc: "Relaxing audio · 10 min",           duration: 600, color: "#16A34A", bg: "#DCFCE7" },
] as const;

type SessionType = (typeof SESSIONS)[number]["type"];

const typeColor: Record<string, string> = { breathing: "#0284C7", meditation: "#7C3AED", music: "#16A34A" };

export default function HealingScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sessions, setSessions] = useState<HealingSession[]>([]);
  const [saving, setSaving] = useState<SessionType | null>(null);
  const [active, setActive] = useState<SessionType | null>(null);
  const breath = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      healingApi.listSessions().then(setSessions).catch(() => setSessions([]));
    }, [])
  );

  const startBreathing = () => {
    setActive("breathing");
    Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1.45, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breath, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  };

  const startMeditation = () => setActive("meditation");

  const playMusic = async () => {
    if (playing && sound) { await sound.pauseAsync(); setPlaying(false); return; }
    if (!sound) {
      const { sound: ns } = await Audio.Sound.createAsync({ uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" });
      setSound(ns);
      await ns.playAsync();
    } else {
      await sound.playAsync();
    }
    setPlaying(true);
    setActive("music");
  };

  const complete = async (type: SessionType, dur: number) => {
    setSaving(type);
    try {
      await healingApi.createSession({ type, durationSeconds: dur, completed: true });
      const latest = await healingApi.listSessions();
      setSessions(latest);
      setActive(null);
      Animated.sequence([
        Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(successAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    } finally {
      setSaving(null);
    }
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: "#F2F7F5" }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={SESSIONS}
      keyExtractor={(item) => item.type}
      ListHeaderComponent={
        <View style={{ gap: 4, marginBottom: 6 }}>
          {Platform.OS === "web" && (
            <Pressable onPress={() => router.replace("/(tabs)")} style={{ marginBottom: 4 }}>
              <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Home</Text>
            </Pressable>
          )}
          <Text style={styles.title}>🌿 Healing Studio</Text>
          <Text style={styles.sub}>Breathing, mindfulness, and calming audio sessions.</Text>
          <Animated.View style={[styles.successBanner, { opacity: successAnim }]}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>✅ Session saved! Great work 🌟</Text>
          </Animated.View>
        </View>
      }
      renderItem={({ item }) => {
        const isActive = active === item.type;
        const isSaving = saving === item.type;
        return (
          <View style={[styles.sessionCard, { borderTopColor: item.color, backgroundColor: isActive ? item.bg : "#fff" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#1F2A37" }}>{item.label}</Text>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>{item.desc}</Text>
              </View>
              {isActive && <View style={[styles.activeDot, { backgroundColor: item.color }]} />}
            </View>

            {/* Breathing circle only for breathing */}
            {item.type === "breathing" && isActive && (
              <View style={{ alignItems: "center", marginVertical: 12 }}>
                <Animated.View style={[styles.breathCircle, { borderColor: item.color, transform: [{ scale: breath }] }]}>
                  <Text style={{ fontSize: 28 }}>🌬️</Text>
                </Animated.View>
                <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>Breathe with the circle</Text>
              </View>
            )}

            {item.type === "meditation" && isActive && (
              <View style={{ alignItems: "center", marginVertical: 12, gap: 6 }}>
                <Text style={{ fontSize: 40 }}>🧘</Text>
                <Text style={{ color: "#7C3AED", fontSize: 14, fontWeight: "700" }}>Focus on your breathing. You are safe. 💜</Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
              {item.type === "breathing" && !isActive && (
                <Pressable style={[styles.actionBtn, { backgroundColor: item.color, flex: 1 }]} onPress={startBreathing}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>▶ Start</Text>
                </Pressable>
              )}
              {item.type === "meditation" && !isActive && (
                <Pressable style={[styles.actionBtn, { backgroundColor: item.color, flex: 1 }]} onPress={startMeditation}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>▶ Begin</Text>
                </Pressable>
              )}
              {item.type === "music" && (
                <Pressable style={[styles.actionBtn, { backgroundColor: item.color, flex: 1 }]} onPress={playMusic}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{playing && isActive ? "⏸ Pause" : "▶ Play Music"}</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.actionBtn, { backgroundColor: isSaving ? "#9CA3AF" : "#F3F4F6", flex: 1 }]}
                onPress={() => complete(item.type, item.duration)}
                disabled={!!isSaving}
              >
                <Text style={{ color: isSaving ? "#fff" : "#374151", fontWeight: "700" }}>
                  {isSaving ? "Saving..." : "✅ Complete"}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        <View style={[styles.sessionCard, { borderTopColor: "#0C8A7B" }]}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#1F2A37", marginBottom: 8 }}>📅 Recent Activity</Text>
          {sessions.length === 0 ? (
            <Text style={{ color: "#9CA3AF", textAlign: "center", paddingVertical: 12 }}>No sessions yet. Complete one above!</Text>
          ) : (
            sessions.slice(0, 5).map((s) => (
              <View key={s._id} style={styles.historyRow}>
                <View style={[styles.historyDot, { backgroundColor: typeColor[s.type] ?? "#0C8A7B" }]} />
                <Text style={{ fontSize: 14, color: "#1F2A37", flex: 1 }}>{s.type}</Text>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>{Math.round(s.durationSeconds / 60)} min</Text>
                <Text style={{ fontSize: 13 }}>{s.completed ? "✅" : "⬜"}</Text>
              </View>
            ))
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: "#1F2A37" },
  sub: { fontSize: 14, color: "#6B7280" },
  successBanner: { backgroundColor: "#16A34A", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 4 },
  sessionCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16, borderTopWidth: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  activeDot: { width: 10, height: 10, borderRadius: 5, marginLeft: "auto" },
  breathCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  actionBtn: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center" },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  historyDot: { width: 8, height: 8, borderRadius: 4 },
});
