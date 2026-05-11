import React from "react";
import { ActivityIndicator, PressableProps } from "react-native";
import styled from "styled-components/native";

const Wrapper = styled.Pressable<{ variant: "primary" | "secondary" }>`
  height: 50px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    variant === "primary" ? theme.colors.primary : theme.colors.secondary};
`;

const Text = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export const Button = ({ title, loading, variant = "primary", ...props }: Props) => {
  return (
    <Wrapper variant={variant} disabled={loading || props.disabled} {...props}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text>{title}</Text>}
    </Wrapper>
  );
};
