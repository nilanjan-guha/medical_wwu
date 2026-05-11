import React, { useCallback, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { moodApi } from "../../src/api/mood.api";
import { journalApi } from "../../src/api/journal.api";
import { wellnessApi } from "../../src/api/wellness.api";
import { Screen } from "../../src/components/ui/Screen";
import { useAuthStore } from "../../src/store/authStore";
import { MoodLog } from "../../src/types";

const PALETTE = {
  teal: "#0C8A7B", tealLight: "#E6F7F5",
  amber: "#F59E0B", amberLight: "#FEF3C7",
  purple: "#7C3AED", purpleLight: "#EDE9FE",
  rose: "#E11D48", roseLight: "#FFE4E6",
  sky: "#0284C7", skyLight: "#E0F2FE",
  green: "#16A34A", greenLight: "#DCFCE7",
};

const moodEmoji: Record<string, string> = {
  Anxiety: "😰", Stress: "😫", Depression: "😞", Fearful: "😨",
  Positive: "😊", Hopeful: "🌟", Lonely: "🫂", default: "💬"
};

function StatTile({ emoji, label, value, bg, color }: { emoji: string; label: string; value: string | number; bg: string; color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };
  return (
    <Animated.View style={[styles.tile, { backgroundColor: bg, transform: [{ scale }] }]}>
      <Pressable onPress={press} style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color }}>{value}</Text>
        <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const width = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(width, { toValue: Math.min((value / max) * 100, 100), duration: 800, useNativeDriver: false }).start();
  }, [value]);
  return (
    <View style={{ height: 10, backgroundColor: "#E5E7EB", borderRadius: 8, overflow: "hidden" }}>
      <Animated.View style={{ height: "100%", borderRadius: 8, backgroundColor: color, width: width.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }} />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [latestMood, setLatestMood] = useState<MoodLog | null>(null);
  const [checkinCount, setCheckinCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [avgPositivity, setAvgPositivity] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadDashboard = useCallback(async () => {
    try {
      const [moods, journals] = await Promise.all([moodApi.history(), journalApi.list()]);
      setLatestMood(moods[0] ?? null);
      setCheckinCount(moods.length);
      setJournalCount(journals.length);
    } catch { /* non-fatal */ }

    try {
      const wellness = await wellnessApi.getProgress();
      setStreakDays(wellness?.streakDays ?? 0);
      setAvgPositivity(Math.round(wellness?.averagePositivity ?? 0));
    } catch { /* non-fatal */ }

    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  useFocusEffect(useCallback(() => { fadeAnim.setValue(0); loadDashboard(); }, [loadDashboard]));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const moodState = latestMood?.emotionalState ?? "default";
  const emoji = moodEmoji[moodState] ?? moodEmoji.default;

  return (
    <Screen>
      <Animated.View style={{ opacity: fadeAnim, gap: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.name}>{user?.name || "Friend"}</Text>
          </View>
          {Platform.OS === "web" && (
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Logout</Text>
            </Pressable>
          )}
        </View>

        {/* Motivational quote */}
        <View style={[styles.quoteCard, { backgroundColor: PALETTE.tealLight, borderLeftColor: PALETTE.teal }]}>
          <Text style={{ fontSize: 14, color: PALETTE.teal, fontStyle: "italic", lineHeight: 20 }}>
            💚 "Small steps every day become your healing strength."
          </Text>
        </View>

        {/* 4 stat tiles */}
        <View style={styles.tileGrid}>
          <StatTile emoji="🔥" label="Day Streak" value={streakDays} bg={PALETTE.amberLight} color={PALETTE.amber} />
          <StatTile emoji="😊" label="Avg Positivity" value={`${avgPositivity}%`} bg={PALETTE.greenLight} color={PALETTE.green} />
          <StatTile emoji="📋" label="Check-ins" value={checkinCount} bg={PALETTE.skyLight} color={PALETTE.sky} />
          <StatTile emoji="📝" label="Journals" value={journalCount} bg={PALETTE.purpleLight} color={PALETTE.purple} />
        </View>

        {/* Current mood */}
        <View style={styles.moodCard}>
          <Text style={styles.cardTitle}>Current Mood</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 36 }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: PALETTE.teal }}>
                {latestMood ? latestMood.emotionalState : "No check-in yet"}
              </Text>
              {latestMood && (
                <>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Positivity {latestMood.positivityScore}%</Text>
                  <ProgressBar value={latestMood.positivityScore} max={100} color={PALETTE.teal} />
                </>
              )}
            </View>
          </View>
          <Pressable style={[styles.actionBtn, { backgroundColor: PALETTE.teal }]} onPress={() => router.push("/(tabs)/checkin")}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>✨ Start Check-In</Text>
          </Pressable>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={[styles.quickBtn, { backgroundColor: PALETTE.purpleLight }]} onPress={() => router.push("/(tabs)/healing")}>
            <Text style={{ fontSize: 20 }}>🌬️</Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: PALETTE.purple }}>Heal</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, { backgroundColor: PALETTE.amberLight }]} onPress={() => router.push("/(tabs)/journal")}>
            <Text style={{ fontSize: 20 }}>📓</Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: PALETTE.amber }}>Journal</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, { backgroundColor: PALETTE.roseLight }]} onPress={() => router.push("/(tabs)/emergency")}>
            <Text style={{ fontSize: 20 }}>🆘</Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: PALETTE.rose }}>SOS</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, { backgroundColor: PALETTE.skyLight }]} onPress={() => router.push("/(tabs)/profile")}>
            <Text style={{ fontSize: 20 }}>👤</Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: PALETTE.sky }}>Profile</Text>
          </Pressable>
        </View>

        {/* Daily plan */}
        <View style={styles.planCard}>
          <Text style={styles.cardTitle}>🗓️ Today's Healing Plan</Text>
          {[
            { icon: "🌬️", text: "5-min breathing session", done: checkinCount > 0 },
            { icon: "🎵", text: "10-min calming music", done: false },
            { icon: "📝", text: "Journal one reflection", done: journalCount > 0 },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 }}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 14, color: item.done ? "#16A34A" : "#374151", textDecorationLine: item.done ? "line-through" : "none" }}>{item.text}</Text>
              <Text style={{ fontSize: 16 }}>{item.done ? "✅" : "⬜"}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 14, color: "#6B7280" },
  name: { fontSize: 24, fontWeight: "800", color: "#1F2A37" },
  logoutBtn: { backgroundColor: "#DC2626", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  quoteCard: { padding: 14, borderRadius: 12, borderLeftWidth: 4 },
  tileGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flex: 1, minWidth: "44%", borderRadius: 16, padding: 14, alignItems: "center" },
  moodCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 10, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1F2A37", marginBottom: 4 },
  actionBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: "#374151" },
  quickBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", gap: 4 },
  planCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
});

