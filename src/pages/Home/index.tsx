import { Box } from 'components/Box';
import Background from 'assets/background.svg';
import PhoneHolding from 'assets/phone-holding.png';

export default function Home() {
  return (
    <Box>
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
      <Box />
    </Box>
  );
}
