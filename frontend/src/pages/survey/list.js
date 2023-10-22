import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { useState, useEffect } from 'react';
import {nextAPi} from "../../utils/axiosUtil";

const Page = () => {
  const [surveys, setSurveys] = useState([]);

    useEffect(() => {
      getSurveys()
    },[])

  const getSurveys = async () => {
    const response = await nextAPi.get('surveys');
    setSurveys(response.data);
  }

return(
  <>
    <Head>
      <title>
        Companies | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h4">
            SURVEY to Earn
          </Typography>
          <Grid
            container
            spacing={3}
          >
            {surveys && surveys.map((survey) => (
              <Grid
                xs={12}
                md={6}
                lg={4}
                key={survey.survey_id}
              >
                <CompanyCard company={survey} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  </>
)
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
