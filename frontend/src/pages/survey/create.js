import Head from 'next/head';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { nextAPi } from '../../utils/axiosUtil';
import { getAvatar, getPublicKey } from '../../utils/storageUtil';

const Page = () => {
  const router = useRouter();


  const [textFields, setTextFields] = useState(['']); // 초기 텍스트 필드 배열

  const [survey, setSurvey] = useState(['']); // 초기 텍스트 필드 배열


  const addTextField = () => {
    const updatedTextFields = [...textFields, '']; // 새로운 텍스트 필드 추가
    setTextFields(updatedTextFields);
  };

  const handleChange = useCallback(
    (event) => {
      setSurvey((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleTextFieldChange = (index, event) => {
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = event.target.value;
    setTextFields(updatedTextFields);
  };

  const createSurvey = async (e) => {
    e.preventDefault();

    //@TODO 돈 먼저 입금하는 로직 넣기
    const surveyData=  {
      title: survey.title,
      compensation: survey.compensation,
      max: survey.max,
      questions: textFields,
      avatar:getAvatar()
    }
    const response =  nextAPi.post('/surveys'
      + '', surveyData);

      console.log(response);
    alert('completed');
    router.push('/survey/list');



  }

  return (
    <>
      <Head>
        <title>
          Register
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Create a SURVEY
              </Typography>
            </Stack>
            <form
              noValidate

            >
              <Grid sx={{ mt: 3 ,mb:3} }
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  required
                  value={survey.title}
                />

              </Grid>
              <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Reward"
                name="compensation"
                type="number"
                onChange={handleChange}
                required
                value={survey.compensation}
              />
              <TextField sx={{ mt: 3 ,mb:3} }
                fullWidth
                label="Number of peoples"
                name="max"
                type="number"
                onChange={handleChange}
                required
                value={survey.max}
              />
            </Grid>
              <Stack spacing={1}>
                  {textFields.map((text, index) => (
                    <TextField
                      key={index}
                      label={`Question ${index + 1}`}
                      fullWidth
                      value={text}
                      onChange={(e) => handleTextFieldChange(index, e)}
                    />
                  ))}
              </Stack>

              <Button variant="contained" onClick={addTextField} sx={{mt:1}}>
                + Add Question
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                onClick={createSurvey}
              >
                Create
              </Button>
            </form>
          </div>
        </Box>
      </Box>

    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default Page;
