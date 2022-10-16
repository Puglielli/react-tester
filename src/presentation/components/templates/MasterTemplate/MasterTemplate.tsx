import { Header, Menu } from 'presentation/components';
import { PropsWithChildren } from 'react';
import { Main, Wrapper } from './MasterTemplate.styles';

export function MasterTemplate({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <Wrapper>
        <Menu />
        <Main>{children}</Main>
      </Wrapper>
    </>
  );
}
