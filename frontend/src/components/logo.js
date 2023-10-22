import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <Typography
    color="neutral.800"
    variant="body3"
  >
    DISCOVEY
  </Typography>
  );
};
