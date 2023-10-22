import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

import { getUserInfo } from 'src/utils/storageUtil';
const user = {
  avatar: '/assets/avatars/avatar-anika-visser.png',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Anika Visser',
  timezone: 'GTM-7'
};

export const AccountProfile = () => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {getUserInfo()}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.timezone}
        </Typography>
      </Box>
    </CardContent>
    <Divider />

  </Card>
);
