import React, { useCallback, useRef, useState } from "react";
import { Alert, Animated, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { emergencyContactsApi } from "../../src/api/wellness.api";

interface Contact { _id: string; name: string; phone: string; relationship?: string; }

const HOTLINES = [
  { label: "🆘 National Suicide Prevention (988)", phone: "988", color: "#E11D48", bg: "#FFE4E6" },
  { label: "🎗️ Cancer Support Helpline", phone: "+18009965228", color: "#7C3AED", bg: "#EDE9FE" },
  { label: "🏥 Crisis & Trauma Line", phone: "+18006884357", color: "#0284C7", bg: "#E0F2FE" },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const savedAnim = useRef(new Animated.Value(0)).current;

  const loadContacts = useCallback(async () => {
    try {
      const data = await emergencyContactsApi.list();
      setContacts(data ?? []);
    } catch { setContacts([]); }
  }, []);

  useFocusEffect(useCallback(() => { loadContacts(); }, [loadContacts]));

  const showSavedFlash = () => {
    Animated.sequence([
      Animated.timing(savedAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(savedAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  };

  const addContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Please enter both a name and phone number.");
      return;
    }
    setAdding(true);
    // Optimistically add to list immediately
    const optimistic: Contact = { _id: `temp-${Date.now()}`, name: name.trim(), phone: phone.trim() };
    setContacts((prev) => [...prev, optimistic]);
    const savedName = name.trim();
    const savedPhone = phone.trim();
    setName("");
    setPhone("");
    setFormOpen(false);
    showSavedFlash();

    try {
      await emergencyContactsApi.add({ name: savedName, phone: savedPhone, relationship: "" });
      // Reload to get real _id from server
      await loadContacts();
    } catch {
      // Remove optimistic entry on failure
      setContacts((prev) => prev.filter((c) => c._id !== optimistic._id));
      Alert.alert("Failed to save contact. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F7F5" }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Header */}
      <View style={{ gap: 4 }}>
        {Platform.OS === "web" && (
          <Pressable onPress={() => router.replace("/(tabs)")} style={{ marginBottom: 4 }}>
            <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Home</Text>
          </Pressable>
        )}
        <Text style={styles.title}>🆘 Emergency Support</Text>
        <Text style={styles.sub}>Immediate help resources for panic moments and urgent support.</Text>
      </View>

      {/* Saved flash */}
      <Animated.View style={[styles.savedBanner, { opacity: savedAnim }]}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>✅ Contact saved!</Text>
      </Animated.View>

      {/* My contacts */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.cardTitle}>👥 My Emergency Contacts</Text>
          <Pressable style={styles.addToggleBtn} onPress={() => setFormOpen((v) => !v)}>
            <Text style={{ color: "#0C8A7B", fontWeight: "800", fontSize: 20 }}>{formOpen ? "✕" : "+"}</Text>
          </Pressable>
        </View>

        {formOpen && (
          <View style={styles.form}>
            <TextInput
              placeholder="Contact name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              placeholder="Phone number (e.g. +1 800 ...)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
            <Pressable style={[styles.saveBtn, { backgroundColor: adding ? "#9CA3AF" : "#0C8A7B" }]} onPress={addContact} disabled={adding}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{adding ? "Saving..." : "💾 Save Contact"}</Text>
            </Pressable>
          </View>
        )}

        {contacts.length === 0 ? (
          <Text style={{ color: "#9CA3AF", textAlign: "center", paddingVertical: 12 }}>No contacts yet. Add one above ↑</Text>
        ) : (
          contacts.map((c) => (
            <View key={c._id} style={styles.contactRow}>
              <View style={styles.contactAvatar}>
                <Text style={{ fontSize: 18, color: "#fff", fontWeight: "800" }}>{c.name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: "#1F2A37", fontSize: 15 }}>{c.name}</Text>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>{c.phone}</Text>
              </View>
              <Pressable style={styles.callBtn} onPress={() => Linking.openURL(`tel:${c.phone}`)}>
                <Text style={{ fontSize: 20 }}>📞</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Crisis hotlines */}
      <Text style={styles.sectionLabel}>📱 Crisis Hotlines</Text>
      {HOTLINES.map((h) => (
        <Pressable key={h.phone} style={[styles.hotlineCard, { backgroundColor: h.bg, borderLeftColor: h.color }]} onPress={() => Linking.openURL(`tel:${h.phone}`)}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: h.color, flex: 1 }}>{h.label}</Text>
          <Text style={{ fontSize: 20 }}>📞</Text>
        </Pressable>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: "#1F2A37" },
  sub: { fontSize: 14, color: "#6B7280" },
  savedBanner: { backgroundColor: "#16A34A", borderRadius: 12, padding: 12, alignItems: "center" },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1F2A37" },
  addToggleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E6F7F5", alignItems: "center", justifyContent: "center" },
  form: { gap: 8, borderTopWidth: 1, borderColor: "#F3F4F6", paddingTop: 12 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, fontSize: 14, color: "#1F2A37" },
  saveBtn: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F9FAFB" },
  contactAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#0C8A7B", alignItems: "center", justifyContent: "center" },
  callBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E6F7F5", alignItems: "center", justifyContent: "center" },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: "#374151" },
  hotlineCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderLeftWidth: 4 },
});
