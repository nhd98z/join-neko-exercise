import { Box, Flex } from 'components/Box';
import { Text } from 'components/Text';

import Background from 'assets/background.svg';
import PhoneHolding from 'assets/phone-holding.png';
import GamersDraft from 'assets/gamers-draft.svg';
import GGPlay from 'assets/gg-play.png';
import AppStore from 'assets/app-store.png';

const AbsoluteBackground = () => (
  <Box
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundImage: `url('${Background}')`,
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
    }}
  />
);

const AbsolutePhoneHolding = () => (
  <img
    src={PhoneHolding}
    alt="phone-holding"
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 'auto',
      height: '100vh',
    }}
  />
);

export default function Home() {
  return (
    <Box>
      <AbsoluteBackground />
      <AbsolutePhoneHolding />
      <Box style={{ position: 'absolute', left: '95px', top: '30%' }}>
        <Text fontSize="56px" fontWeight={700} lineHeight={1.25}>
          Gaming Mode
        </Text>
        <Text fontSize="56px" fontWeight={700} lineHeight={1.25}>
          Built by <span style={{ color: '#FC7819' }}>Gamers</span>
        </Text>
        <Text fontSize="56px" fontWeight={700} lineHeight={1.25}>
          for&nbsp;
          <span style={{ position: 'relative' }}>
            Gamers
            <img
              src={GamersDraft}
              style={{ position: 'absolute', top: '0', left: '-10px', height: '100%', maxWidth: 'unset' }}
              alt="gamers-draft"
            />
          </span>
        </Text>
        <Flex mt="96px" style={{ gap: '20px' }}>
          <Box tabIndex={0} style={{ cursor: 'pointer' }}>
            <img src={GGPlay} alt="gg-play" />
          </Box>
          <Box tabIndex={0} style={{ cursor: 'pointer' }}>
            <img src={AppStore} alt="app-store" />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
