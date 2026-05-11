import styled from "styled-components/native";

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 16px;
  line-height: 24px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
`;
