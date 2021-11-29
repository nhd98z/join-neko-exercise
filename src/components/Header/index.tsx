import { Box, Flex } from 'components/Box';
import { Text } from 'components/Text';
import styled from 'styled-components';
import LogoText from 'assets/logo-text.svg';
import { BsChevronDown } from 'react-icons/all';

const FixedBox = styled(Box)`
  position: fixed;
  z-index: 1;
  width: 100%;
`;

const MenuItem = ({ text }: { text: string }) => (
  <Flex alignItems="center" tabIndex={0} style={{ cursor: 'pointer' }}>
    <Text fontSize="20px" mr="8px">
      {text}
    </Text>
    <BsChevronDown />
  </Flex>
);

const ButtonBase = styled(Flex)`
  padding: 8px 34px;
  border-radius: 34px;
  border: 1px solid #ffffff;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
`;

const ButtonDocs = styled(ButtonBase)`
  background: transparent;
`;

const ButtonDownload = styled(ButtonBase)`
  background: #ffffff;
  color: #16001e;
`;

export default function Header() {
  return (
    <FixedBox>
      <Flex p="27px 205px 27px 95px" justifyContent="space-between">
        <Flex style={{ gap: '60px' }}>
          <Box tabIndex={0} style={{ cursor: 'pointer' }}>
            <img src={LogoText} alt="logo-text" style={{ minHeight: '52px', height: '52px', width: 'auto' }} />
          </Box>
          <MenuItem text="EN" />
        </Flex>
        <Flex style={{ gap: '60px' }}>
          <Flex style={{ gap: '40px' }}>
            <MenuItem text="Features" />
            <MenuItem text="About" />
            <MenuItem text="Learn" />
          </Flex>
          <Flex style={{ gap: '20px' }}>
            <ButtonDocs tabIndex={0}>Docs</ButtonDocs>
            <ButtonDownload tabIndex={0}>Download</ButtonDownload>
          </Flex>
        </Flex>
      </Flex>
    </FixedBox>
  );
}
