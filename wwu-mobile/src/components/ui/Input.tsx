import React from "react";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

const Field = styled.TextInput`
  height: 48px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 12px;
`;

export const Input = (props: TextInputProps) => {
  return <Field placeholderTextColor="#9CA3AF" {...props} />;
};
