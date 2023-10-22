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

export const AccountProfile = () => {
  const userInfo = JSON.parse(getUserInfo());
  console.log(userInfo);
  return (
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
          src={userInfo.profileImage}
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
          {userInfo.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userInfo.email}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userInfo.typeOfLogin}
        </Typography>
      </Box>
    </CardContent>
    <Divider />

  </Card>
)};
