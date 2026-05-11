import React, { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import styled from "styled-components/native";

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
`;

const Inner = styled.View`
  padding: 20px;
  gap: 14px;
`;

export const Screen = ({ children }: PropsWithChildren) => {
  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Inner>{children}</Inner>
      </Content>
    </Container>
  );
};
