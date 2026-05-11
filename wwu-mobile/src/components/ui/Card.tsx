import styled from "styled-components/native";

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 18px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-offset: 0px 6px;
  shadow-radius: 10px;
  elevation: 4;
  gap: 8px;
`;
