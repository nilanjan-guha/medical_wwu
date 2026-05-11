import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert as RNAlert, View, Text } from "react-native";
import axios from "axios";
import { z } from "zod";
import { authApi } from "../../src/api/auth.api";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { Screen } from "../../src/components/ui/Screen";
import { Subtitle, Title } from "../../src/components/ui/Text";
import { useAuthStore } from "../../src/store/authStore";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  healthConditions: z.string(),
  consentForEmotionAnalysis: z.boolean()
});

export default function SignupScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      healthConditions: "Cancer",
      consentForEmotionAnalysis: true
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      console.log("📝 Submitting signup with values:", {
        name: values.name,
        email: values.email,
        healthConditions: values.healthConditions
      });

      const data = await authApi.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        healthConditions: values.healthConditions
          .split(",")
          .map((v: string) => v.trim())
          .filter(Boolean),
        consentForEmotionAnalysis: values.consentForEmotionAnalysis
      });

      console.log("✅ Signup response:", data);
      await setSession(data.user, data.accessToken, data.refreshToken);
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || err.message || "Signup failed. Try again."
        : err instanceof Error
          ? err.message
          : "Signup failed. Try again.";
      console.error("❌ Signup error:", message, err);
      setError(message);
      RNAlert.alert("Signup Error", message);
    }
  });

  return (
    <Screen>
      <Title>Create Account</Title>
      <Subtitle>Set up your personalized emotional wellness experience.</Subtitle>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Full Name" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Email" autoCapitalize="none" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Password" secureTextEntry value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="healthConditions"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Health conditions (comma-separated)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {error && (
        <View
          style={{
            backgroundColor: "#fee2e2",
            borderColor: "#dc2626",
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16
          }}
        >
          <Text style={{ color: "#991b1b", fontSize: 14, fontWeight: "500" }}>{error}</Text>
        </View>
      )}
      <Button title="Sign Up" loading={isSubmitting} onPress={onSubmit} />
    </Screen>
  );
}
