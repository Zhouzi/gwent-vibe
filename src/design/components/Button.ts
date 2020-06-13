import styled from "styled-components";

export const IconButton = styled.button`
  font: inherit;
  color: inherit;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;

  &:focus,
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.4;
  }
`;
