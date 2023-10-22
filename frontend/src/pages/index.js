import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { subDays, subHours } from 'date-fns';
import { RegisterPush } from 'src/sections/overview/register-push';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getEthereumAddress, getPrivateKey } from '../utils/storageUtil';
import { kvServiceAPi, nextAPi, proofServiceAPi } from '../utils/axiosUtil';
import { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_KV_GITHUB_CLIENT_ID } from '../const/commonConst';
import { signMessage } from '../utils/signUtil';
import {GithubNextId} from "../sections/oauth/githubNextId";

const now = new Date();


const Page = () => {
  return (
  <>
    <Head>
      <title>
        Overview
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth="lg">          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              Welcome to{' '}
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >
                Discovey
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >
              <br/>
            <img
              alt=""
              width="75%"
              src="/assets/overview.png"
            />
            </Typography>
          </Box>
      </Container>
    </Box>
  </>
);
}
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
