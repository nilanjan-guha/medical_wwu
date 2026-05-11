import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";
import { authApi } from "../../src/api/auth.api";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { Screen } from "../../src/components/ui/Screen";
import { Subtitle, Title } from "../../src/components/ui/Text";
import { useAuthStore } from "../../src/store/authStore";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8)
});

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setErrorMessage(null);
      try {
        const data = await authApi.login({
          email: values.email.trim().toLowerCase(),
          password: values.password
        });
        await setSession(data.user, data.accessToken, data.refreshToken);
        router.replace("/(tabs)");
      } catch (err: any) {
        const message = err?.response?.data?.message ?? "Could not log in.";
        setErrorMessage(message);
        Alert.alert("Login failed", message);
      }
    },
    (invalid) => {
      const message =
        invalid.email?.message ??
        invalid.password?.message ??
        "Please enter a valid email and password.";
      setErrorMessage(String(message));
    }
  );

  return (
    <Screen>
      <View style={{ alignItems: "flex-start" }}>
        <Pressable onPress={() => router.replace("/(auth)/welcome")} style={{ paddingVertical: 4 }}>
          <Text style={{ color: "#0C8A7B", fontWeight: "700" }}>← Back to Home</Text>
        </Pressable>
      </View>
      <Title>Welcome Back</Title>
      <Subtitle>Log in to continue your healing journey.</Subtitle>
      {errorMessage ? (
        <View
          style={{
            backgroundColor: "#FEE2E2",
            borderColor: "#FCA5A5",
            borderWidth: 1,
            borderRadius: 12,
            padding: 12
          }}
        >
          <Text style={{ color: "#B91C1C", fontWeight: "700" }}>{errorMessage}</Text>
        </View>
      ) : null}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email address"
            autoCapitalize="none"
            value={value}
            onChangeText={(text) => {
              setErrorMessage(null);
              onChange(text);
            }}
          />
        )}
      />
      {errors.email?.message ? (
        <Text style={{ color: "#B91C1C", fontSize: 12 }}>{errors.email.message}</Text>
      ) : null}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={(text) => {
              setErrorMessage(null);
              onChange(text);
            }}
          />
        )}
      />
      {errors.password?.message ? (
        <Text style={{ color: "#B91C1C", fontSize: 12 }}>{errors.password.message}</Text>
      ) : null}
      <Button title="Login" loading={isSubmitting} onPress={onSubmit} />
      <Button
        title="Forgot Password"
        variant="secondary"
        onPress={() => router.push("/(auth)/forgot-password")}
      />
    </Screen>
  );
}
