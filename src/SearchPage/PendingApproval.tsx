import React from "react";
import styled from "styled-components";

import { colors } from "../ui";

export const PendingApproval = () => (
  <Container>Pending Ethics Committee Approval</Container>
);

const Container = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  color: ${colors.OrangeText};
  background-color: rgba(255, 196, 0, 0.3);
  padding: 0px 8px;
  width: fit-content;
  border-radius: 100px;
  justify-self: flex-end;
`;