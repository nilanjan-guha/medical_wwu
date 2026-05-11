import React, { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { profileApi } from "../../src/api/profile.api";
import { useAuthStore } from "../../src/store/authStore";
import { useThemeStore } from "../../src/store/themeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const [savingConsent, setSavingConsent] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    profileApi.get().then((u) => useAuthStore.setState({ user: u })).catch(() => undefined);
  }, []);

  const updateConsent = async (value: boolean) => {
    setSavingConsent(true);
    try {
      const updated = await profileApi.update({ consentForEmotionAnalysis: value });
      useAuthStore.setState({ user: updated });
    } finally {
      setSavingConsent(false);
    }
  };

  const runDeleteAccount = async () => {
    setDeleting(true);
    try {
      await profileApi.deleteAccount();
      await logout();
      router.replace("/(auth)/welcome");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    const title = "⚠️ Delete Account";
    const message = "This will permanently delete your account, all mood history, journals, and sessions. This cannot be undone.";

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (!ok) {
        return;
      }
      void runDeleteAccount();
      return;
    }

    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => {
            void runDeleteAccount();
          }
        }
      ]
    );
  };

  const initials = (user?.name ?? "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const conditions = user?.healthConditions?.join(", ") || "None listed";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F7F5" }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      {Platform.OS === "web" && (
        <Pressable onPress={() => router.replace("/(tabs)")} style={{ marginBottom: 4 }}>
          <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Home</Text>
        </Pressable>
      )}

      {/* Avatar card */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarCircle}>
          <Text style={{ fontSize: 34, fontWeight: "800", color: "#fff" }}>{initials}</Text>
        </View>
        <Text style={styles.nameText}>{user?.name || "—"}</Text>
        <Text style={styles.emailText}>{user?.email || "—"}</Text>
        <View style={styles.conditionBadge}>
          <Text style={{ fontSize: 12, color: "#0C8A7B", fontWeight: "700" }}>🏥 {conditions}</Text>
        </View>
      </View>

      {/* Settings card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Settings</Text>

        <View style={styles.settingRow}>
          <View style={{ gap: 2 }}>
            <Text style={styles.settingLabel}>{mode === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}</Text>
            <Text style={styles.settingDesc}>Switch UI theme</Text>
          </View>
          <Switch value={mode === "dark"} onValueChange={toggleMode} trackColor={{ true: "#0C8A7B", false: "#D1D5DB" }} />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={{ gap: 2, flex: 1, marginRight: 12 }}>
            <Text style={styles.settingLabel}>🤖 AI Emotion Analysis</Text>
            <Text style={styles.settingDesc}>Allow AI to analyze your mood check-ins</Text>
          </View>
          <Switch
            value={Boolean(user?.consentForEmotionAnalysis)}
            onValueChange={updateConsent}
            disabled={savingConsent}
            trackColor={{ true: "#0C8A7B", false: "#D1D5DB" }}
          />
        </View>
      </View>

      {/* Account actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 Account</Text>
        <Pressable style={[styles.btn, { backgroundColor: "#0C8A7B" }]} onPress={logout}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>🚪 Logout</Text>
        </Pressable>
      </View>

      {/* Danger zone */}
      <View style={[styles.card, { borderColor: "#FCA5A5", borderWidth: 1 }]}>
        <Text style={[styles.cardTitle, { color: "#DC2626" }]}>🔴 Danger Zone</Text>
        <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 18 }}>
          Deleting your account is permanent. All your data — mood history, journals, healing sessions — will be erased immediately.
        </Text>
        <Pressable
          style={[styles.btn, { backgroundColor: deleting ? "#9CA3AF" : "#DC2626" }]}
          onPress={confirmDelete}
          disabled={deleting}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{deleting ? "Deleting... ⏳" : "🗑️ Delete My Account"}</Text>
        </Pressable>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center", gap: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#0C8A7B", alignItems: "center", justifyContent: "center" },
  nameText: { fontSize: 22, fontWeight: "800", color: "#1F2A37" },
  emailText: { fontSize: 14, color: "#6B7280" },
  conditionBadge: { backgroundColor: "#E6F7F5", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 18, gap: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1F2A37" },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  settingLabel: { fontSize: 15, fontWeight: "700", color: "#1F2A37" },
  settingDesc: { fontSize: 12, color: "#9CA3AF" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
  btn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
});
