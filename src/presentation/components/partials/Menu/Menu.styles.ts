import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 240px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.palette.common.white};
  padding: 16px 28px;
`;
