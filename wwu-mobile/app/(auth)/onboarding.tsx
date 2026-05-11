import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Animated2, { FadeInRight } from "react-native-reanimated";

const steps = [
  {
    icon: "🎗️",
    title: "You are not alone",
    body: "WWU is built for cancer patients, chronic illness patients, and anyone going through lab tests or difficult diagnoses.",
    color: "#E11D48",
    bg: "#FFE4E6",
  },
  {
    icon: "💚",
    title: "Free. Always.",
    body: "This app is completely free. We analyze your feelings to recommend breathing, calming music, mindfulness, and journaling — personalized for you.",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    icon: "🔒",
    title: "Your privacy matters",
    body: "All data stays private and encrypted. AI analysis is opt-in. You can withdraw consent any time from your Profile settings.",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const lastStep = useMemo(() => step === steps.length - 1, [step]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (lastStep) { router.replace("/(auth)/signup"); return; }
    const next = step + 1;
    Animated.timing(progressAnim, { toValue: next / (steps.length - 1), duration: 400, useNativeDriver: false }).start();
    setStep(next);
  };

  const current = steps[step];

  return (
    <View style={[styles.root, { backgroundColor: current.bg }]}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.progressDot, { backgroundColor: i <= step ? current.color : "#D1D5DB", width: i === step ? 24 : 8 }]} />
        ))}
      </View>

      <Animated2.View key={step} entering={FadeInRight.duration(400)} style={styles.card}>
        <Text style={{ fontSize: 64, textAlign: "center" }}>{current.icon}</Text>
        <Text style={[styles.title, { color: current.color }]}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
      </Animated2.View>

      <View style={styles.btnRow}>
        {step > 0 && (
          <Pressable style={[styles.secondaryBtn, { borderColor: current.color }]} onPress={() => setStep((p) => p - 1)}>
            <Text style={{ color: current.color, fontWeight: "700" }}>← Back</Text>
          </Pressable>
        )}
        <Pressable style={[styles.primaryBtn, { backgroundColor: current.color, flex: 1 }]} onPress={goNext}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
            {lastStep ? "🚀 Create Free Account" : "Next →"}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.replace("/(auth)/login")} style={{ alignItems: "center", marginTop: 4 }}>
        <Text style={{ color: current.color, fontSize: 14, fontWeight: "600", opacity: 0.8 }}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 28, justifyContent: "center", gap: 24 },
  progressBar: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 8 },
  progressDot: { height: 8, borderRadius: 4 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 28, gap: 16, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  title: { fontSize: 26, fontWeight: "900", textAlign: "center" },
  body: { fontSize: 16, color: "#374151", textAlign: "center", lineHeight: 24 },
  btnRow: { flexDirection: "row", gap: 10 },
  primaryBtn: { paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  secondaryBtn: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, alignItems: "center", borderWidth: 2 },
});
