import styled from "styled-components";

export const InputCheckbox = styled.input.attrs({ type: "checkbox" })``;

export const InputRange = styled.input.attrs({ type: "range" })`
  width: 100%;
`;

export const Input = styled.input`
  font: inherit;
  color: ${(props) => props.theme.colors.background.main};
  background: #fff;
  border: none;
  border-radius: 2px;
  padding: 0.4rem;
  width: 100%;
`;
