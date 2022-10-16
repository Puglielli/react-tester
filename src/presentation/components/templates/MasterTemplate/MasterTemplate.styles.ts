import styled from 'styled-components';

export const Main = styled.main`
  display: flex;
  flex-grow: 1;
  height: 100%;
  padding: 16px;
`;

export const Wrapper = styled.div`
  display: flex;

  ${({ theme }) => theme.breakpoints.up('xs')} {
    min-height: calc(100vh - 56px);
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    min-height: calc(100vh - 64px);
  }
`;
