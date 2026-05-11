import React, { useRef, useState } from "react";
import { Alert, Animated, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { moodApi } from "../../src/api/mood.api";
import { Screen } from "../../src/components/ui/Screen";

const FIELDS = [
  { key: "anxiety",      label: "Anxiety",       emoji: "😰", color: "#E11D48", invertGood: true },
  { key: "fear",         label: "Fear",           emoji: "😨", color: "#7C3AED", invertGood: true },
  { key: "stress",       label: "Stress",         emoji: "😫", color: "#F59E0B", invertGood: true },
  { key: "depression",   label: "Depression",     emoji: "😞", color: "#0284C7", invertGood: true },
  { key: "sleepQuality", label: "Sleep Quality",  emoji: "😴", color: "#16A34A", invertGood: false },
  { key: "motivation",   label: "Motivation",     emoji: "💪", color: "#0C8A7B", invertGood: false },
  { key: "painLevel",    label: "Pain Level",     emoji: "😣", color: "#DC2626", invertGood: true },
] as const;

type FormKey = (typeof FIELDS)[number]["key"];

function getBarColor(value: number, invertGood: boolean) {
  const isGood = invertGood ? value <= 4 : value >= 7;
  const isMid = invertGood ? value <= 6 : value >= 4;
  return isGood ? "#16A34A" : isMid ? "#F59E0B" : "#E11D48";
}

function SliderCard({ field, value, onChange }: { field: (typeof FIELDS)[number]; value: number; onChange: (v: number) => void }) {
  const barColor = getBarColor(value, field.invertGood);
  return (
    <View style={[styles.sliderCard, { borderLeftColor: field.color }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#1F2A37" }}>
          {field.emoji} {field.label}
        </Text>
        <View style={[styles.badge, { backgroundColor: barColor }]}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>{value}</Text>
        </View>
      </View>
      <Slider
        minimumValue={0} maximumValue={10} step={1} value={value}
        onValueChange={onChange}
        minimumTrackTintColor={barColor}
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor={field.color}
      />
      <View style={{ height: 4, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
        <View style={{ width: `${value * 10}%`, height: "100%", backgroundColor: barColor, borderRadius: 4 }} />
      </View>
    </View>
  );
}

export default function CheckinScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ anxiety: 5, fear: 5, stress: 5, depression: 4, sleepQuality: 5, motivation: 5, painLevel: 5, freeText: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ emotionalState: string; positivityScore: number; suggestions: string[] } | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const submit = async () => {
    setLoading(true);
    try {
      const data = await moodApi.submitCheckin(form);
      const mood = data.mood;
      setResult({ emotionalState: mood.emotionalState, positivityScore: mood.positivityScore, suggestions: mood.aiSuggestions ?? [] });
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      setForm({ anxiety: 5, fear: 5, stress: 5, depression: 4, sleepQuality: 5, motivation: 5, painLevel: 5, freeText: "" });
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not submit check-in.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: FormKey) => (v: number) => setForm((f) => ({ ...f, [key]: v }));

  const moodEmojis: Record<string, string> = { Anxiety: "😰", Stress: "😫", Depression: "😞", Fearful: "😨", Positive: "😊", Hopeful: "🌟", Lonely: "🫂" };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F7F5" }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Header */}
      <View style={styles.header}>
        {Platform.OS === "web" && (
          <Pressable onPress={() => router.replace("/(tabs)")} style={styles.backBtn}>
            <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Home</Text>
          </Pressable>
        )}
        <Text style={styles.title}>🧠 Emotional Check-In</Text>
        <Text style={styles.sub}>Rate how you feel right now. AI will personalize your healing plan.</Text>
      </View>

      {/* Result card */}
      {result && (
        <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
          <Text style={{ fontSize: 32, textAlign: "center" }}>{moodEmojis[result.emotionalState] ?? "💬"}</Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#0C8A7B", textAlign: "center" }}>{result.emotionalState}</Text>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>Positivity score: {result.positivityScore}%</Text>
          <View style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 8, marginTop: 4, overflow: "hidden" }}>
            <View style={{ width: `${result.positivityScore}%`, height: "100%", backgroundColor: "#16A34A", borderRadius: 8 }} />
          </View>
          {result.suggestions.slice(0, 2).map((s, i) => (
            <Text key={i} style={{ fontSize: 13, color: "#374151" }}>✨ {s}</Text>
          ))}
          <Pressable style={[styles.btn, { backgroundColor: "#7C3AED" }]} onPress={() => router.push("/(tabs)/healing")}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>🌬️ Open Healing</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Sliders */}
      {FIELDS.map((f) => (
        <SliderCard key={f.key} field={f} value={form[f.key]} onChange={set(f.key)} />
      ))}

      {/* Free text */}
      <View style={styles.textCard}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#1F2A37", marginBottom: 6 }}>📝 Anything on your mind?</Text>
        <TextInput
          multiline placeholder="Describe your emotions..."
          value={form.freeText}
          onChangeText={(t) => setForm((f) => ({ ...f, freeText: t }))}
          style={styles.textInput}
        />
      </View>

      <Pressable style={[styles.btn, { backgroundColor: loading ? "#9CA3AF" : "#0C8A7B" }]} onPress={submit} disabled={loading}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{loading ? "Analyzing... 🔍" : "✨ Analyze My Mood"}</Text>
      </Pressable>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4, marginBottom: 4 },
  backBtn: { marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "800", color: "#1F2A37" },
  sub: { fontSize: 14, color: "#6B7280" },
  resultCard: { backgroundColor: "#fff", borderRadius: 18, padding: 18, gap: 8, borderLeftWidth: 4, borderLeftColor: "#0C8A7B", shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  sliderCard: { backgroundColor: "#fff", borderRadius: 14, padding: 14, gap: 8, borderLeftWidth: 4, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  textCard: { backgroundColor: "#fff", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  textInput: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, padding: 10, minHeight: 90, color: "#1F2A37" },
  btn: { paddingVertical: 16, borderRadius: 16, alignItems: "center" },
});
