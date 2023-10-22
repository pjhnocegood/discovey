import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import UsersIcon from '@heroicons/react/24/solid/ChatBubbleOvalLeftIcon';
import { Avatar, 
  Button,
  Card,
  CardActions, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
  import { PushAPI } from '@pushprotocol/restapi'
  import { ethers } from 'ethers'

export const RegisterPush = (props) => {
  const { difference, positive = false, sx, value } = props;
const changeUserInfo = async ()=>{ 
  const signer = ethers.Wallet.createRandom()
  const userAlice = await PushAPI.initialize(signer, { env: 'staging' })
  const pushChannelAdress = '0xB88460Bb2696CAb9D66013A05dFF29a28330689D'
  const response = await userAlice.notification.subscribe(
    `eip155:5:${pushChannelAdress}`
  );
}
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
              Subscribe Push
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <UsersIcon />
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
          <Button variant="contained" onClick={changeUserInfo}>
            Subscribe
          </Button>
        </CardActions>
          </Stack>
      </CardContent>
    </Card>
  );
};

RegisterPush.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object
};

