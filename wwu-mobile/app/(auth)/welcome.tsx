import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Background blobs */}
      <View style={[styles.blob, { backgroundColor: "#E6F7F5", top: -60, left: -80, width: 250, height: 250, borderRadius: 125 }]} />
      <View style={[styles.blob, { backgroundColor: "#EDE9FE", bottom: 60, right: -100, width: 300, height: 300, borderRadius: 150 }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo */}
        <Animated.View style={[styles.logoCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={{ fontSize: 56 }}>💚</Text>
        </Animated.View>

        <Text style={styles.appName}>We Are With U</Text>
        <View style={styles.tagBadge}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#16A34A" }}>✨ Free for all patients</Text>
        </View>
        <Text style={styles.subtitle}>
          Emotional wellness for cancer patients,{"\n"}
          chronic illness, and lab test journeys.{"\n"}
          Breathing · Music · Mindfulness · Journal
        </Text>

        {/* Feature pills */}
        <View style={styles.pillRow}>
          {["🌬️ Breathing", "🎵 Music", "🧘 Mindfulness", "📝 Journal"].map((p) => (
            <View key={p} style={styles.pill}>
              <Text style={{ fontSize: 13, color: "#0C8A7B", fontWeight: "600" }}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={styles.btnGroup}>
          <Pressable style={[styles.btn, { backgroundColor: "#0C8A7B" }]} onPress={() => router.push("/(auth)/onboarding")}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>🌟 Get Started — Free</Text>
          </Pressable>
          <Pressable style={[styles.btn, { backgroundColor: "#fff", borderWidth: 2, borderColor: "#0C8A7B" }]} onPress={() => router.push("/(auth)/login")}>
            <Text style={{ color: "#0C8A7B", fontWeight: "800", fontSize: 16 }}>🔑 Login</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F7F5", justifyContent: "center" },
  blob: { position: "absolute" },
  content: { paddingHorizontal: 28, gap: 16, alignItems: "center" },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#E6F7F5", alignItems: "center", justifyContent: "center", shadowColor: "#0C8A7B", shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  appName: { fontSize: 34, fontWeight: "900", color: "#0C8A7B", letterSpacing: -1 },
  tagBadge: { backgroundColor: "#DCFCE7", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  subtitle: { fontSize: 16, color: "#374151", textAlign: "center", lineHeight: 24 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  pill: { backgroundColor: "#E6F7F5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#A7F3D0" },
  btnGroup: { width: "100%", gap: 10, marginTop: 8 },
  btn: { paddingVertical: 16, borderRadius: 16, alignItems: "center" },
});

