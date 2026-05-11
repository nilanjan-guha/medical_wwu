import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { journalApi } from "../../src/api/journal.api";
import { Journal } from "../../src/types";

const moodEmoji: Record<string, string> = { Anxiety: "😰", Stress: "😫", Depression: "😞", Fearful: "😨", Positive: "😊", Hopeful: "🌟", Lonely: "🫂" };
const moodColor: Record<string, string> = { Anxiety: "#E11D48", Stress: "#F59E0B", Depression: "#0284C7", Fearful: "#7C3AED", Positive: "#16A34A", Hopeful: "#0C8A7B", Lonely: "#6B7280" };

export default function JournalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async (q = "") => {
    setLoading(true);
    try {
      const data = await journalApi.list(q);
      setJournals(data);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not load journals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(React.useCallback(() => { fadeAnim.setValue(0); load(search); }, [search]));

  const save = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Please enter both a title and content.");
      return;
    }
    setSaving(true);
    try {
      await journalApi.create({ title: title.trim(), content: content.trim(), tags: ["daily"] });
      setTitle("");
      setContent("");
      setExpanded(false);
      await load(search);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not save journal.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await journalApi.remove(id);
      await load(search);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message ?? "Could not delete journal.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F7F5" }}>
      <FlatList
        data={journals}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 8 }}>
            {/* Header */}
            <View style={styles.header}>
              {Platform.OS === "web" && (
                <Pressable onPress={() => router.replace("/(tabs)")} style={styles.backBtn}>
                  <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Home</Text>
                </Pressable>
              )}
              <Text style={styles.title}>📓 Emotional Journal</Text>
              <Text style={styles.sub}>{journals.length} {journals.length === 1 ? "entry" : "entries"}</Text>
            </View>

            {/* Write button / expand area */}
            <Pressable style={[styles.newBtn, { backgroundColor: expanded ? "#fff" : "#0C8A7B" }]} onPress={() => setExpanded((e) => !e)}>
              <Text style={{ fontWeight: "800", color: expanded ? "#0C8A7B" : "#fff", fontSize: 15 }}>
                {expanded ? "✕ Discard" : "✏️ Write New Entry"}
              </Text>
            </Pressable>

            {expanded && (
              <View style={styles.form}>
                <TextInput placeholder="✨ Give it a title..." value={title} onChangeText={setTitle} style={styles.inputTitle} placeholderTextColor="#9CA3AF" />
                <TextInput placeholder="Write your thoughts..." multiline value={content} onChangeText={setContent} style={styles.inputBody} placeholderTextColor="#9CA3AF" />
                <Pressable style={[styles.saveBtn, { backgroundColor: saving ? "#9CA3AF" : "#0C8A7B" }]} onPress={save} disabled={saving}>
                  <Text style={{ color: "#fff", fontWeight: "800" }}>{saving ? "Saving... ⏳" : "💾 Save Journal"}</Text>
                </Pressable>
              </View>
            )}

            {/* Search */}
            <View style={styles.searchBox}>
              <Text style={{ fontSize: 16 }}>🔍</Text>
              <TextInput
                placeholder="Search journals..."
                value={search}
                onChangeText={(t) => { setSearch(t); load(t); }}
                style={{ flex: 1, fontSize: 14, color: "#1F2A37" }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 40, textAlign: "center" }}>📭</Text>
            <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 8 }}>
              {loading ? "Loading..." : "No journals yet. Write your first reflection."}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const state = item.emotionalState ?? "";
          const color = moodColor[state] ?? "#0C8A7B";
          const emoji = moodEmoji[state] ?? "💬";
          return (
            <Animated.View style={[styles.journalCard, { borderLeftColor: color, opacity: fadeAnim }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: "#1F2A37" }}>{item.title}</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 18 }} numberOfLines={2}>{item.content}</Text>
                </View>
                <Pressable onPress={() => remove(item._id)} style={styles.deleteBtn}>
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                <View style={[styles.moodBadge, { backgroundColor: color + "22" }]}>
                  <Text style={{ fontSize: 11, color, fontWeight: "700" }}>{emoji} {state || "Pending AI"}</Text>
                </View>
                {item.positivityScore != null && (
                  <View style={styles.scoreBadge}>
                    <Text style={{ fontSize: 11, color: "#0C8A7B", fontWeight: "700" }}>✨ {item.positivityScore}%</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 2 },
  backBtn: { marginBottom: 4 },
  title: { fontSize: 24, fontWeight: "800", color: "#1F2A37" },
  sub: { fontSize: 13, color: "#6B7280" },
  newBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 2, borderColor: "#0C8A7B" },
  form: { backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 10, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  inputTitle: { borderBottomWidth: 1, borderColor: "#E5E7EB", paddingVertical: 8, fontSize: 16, fontWeight: "700", color: "#1F2A37" },
  inputBody: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 10, minHeight: 100, color: "#1F2A37", fontSize: 14 },
  saveBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 12, padding: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, padding: 32, alignItems: "center" },
  journalCard: { backgroundColor: "#fff", borderRadius: 14, padding: 14, borderLeftWidth: 4, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  deleteBtn: { padding: 4, marginLeft: 8 },
  moodBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: "#E6F7F5" },
});
