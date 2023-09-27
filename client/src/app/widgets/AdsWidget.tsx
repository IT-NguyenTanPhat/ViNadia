import { Link, Typography, useTheme } from '@mui/material';
import { WidgetWrapper, FlexBox } from '../../components/Styled';
import ITheme from '../../types/Theme';

export default function AdsWidget() {
  const { palette }: ITheme = useTheme();
  const { main, dark, medium } = palette.neutral;

  return (
    <WidgetWrapper>
      <FlexBox mb="10px">
        <Typography color={dark} variant="h5" fontWeight={500}>
          Sponsored
        </Typography>
      </FlexBox>
      <img
        style={{ borderRadius: '6px', marginBottom: '5px' }}
        width="100%"
        height="auto"
        alt="Ads"
        src="https://th.bing.com/th/id/OIP.pef-w5XIXoLJXX_Or3DwlwHaE8?pid=ImgDet&rs=1"
      />
      <FlexBox>
        <Typography color={main}>Mika Cosmetics</Typography>
        <Link target="_blank" href="https://mikacosmetics.com">
          mikacosmetics.com
        </Link>
      </FlexBox>
      <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
}
