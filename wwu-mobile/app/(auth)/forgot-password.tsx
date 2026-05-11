import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { authApi } from "../../src/api/auth.api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim()) { Alert.alert("Please enter your email."); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F7F5" }} contentContainerStyle={{ padding: 24, gap: 16, flexGrow: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 36, textAlign: "center" }}>🔐</Text>
      <Text style={styles.title}>Forgot Password</Text>

      {!sent ? (
        <>
          <Text style={styles.sub}>Enter your registered email and we'll send you a reset link.</Text>
          <TextInput
            placeholder="your@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          <Pressable style={[styles.btn, { backgroundColor: loading ? "#9CA3AF" : "#0C8A7B" }]} onPress={onSubmit} disabled={loading}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{loading ? "Sending... ✉️" : "📧 Send Reset Link"}</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.successCard}>
          <Text style={{ fontSize: 40, textAlign: "center" }}>✅</Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#16A34A", textAlign: "center" }}>Email sent!</Text>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 }}>
            If <Text style={{ fontWeight: "700" }}>{email}</Text> is registered, you'll receive a password reset link shortly. Check your inbox and spam folder.
          </Text>
        </View>
      )}

      <Pressable onPress={() => router.replace("/(auth)/login")} style={{ alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Back to Login</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "800", color: "#1F2A37", textAlign: "center" },
  sub: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 14, padding: 16, fontSize: 16, color: "#1F2A37", backgroundColor: "#fff" },
  btn: { paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  successCard: { backgroundColor: "#fff", borderRadius: 18, padding: 24, gap: 10, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
});

