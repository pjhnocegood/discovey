import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { Avatar, Card, CardActions, Button, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewTotalProfit = (props) => {
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              LINK GITHUB(DISCOVEY)
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {props.user.oauth.githubInfo.id===undefined || props.user.oauth.githubInfo.id==='' ?
            <Button variant="contained" onClick={props.gitHubIntegrationByKv}>
              Link
            </Button>
            :<div>{props.user.oauth.githubInfo.id}</div>


          }

        </CardActions>
          </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
