
import { useRouter } from 'next/router';

  import Head from 'next/head';
  import {
  Box, Button,
  Card, CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack, TextField,
  Typography
} from '@mui/material';
  import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
  import { SettingsPassword } from 'src/sections/settings/settings-password';
  import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
  import {useState, useEffect} from'react';
import { getAvatar, getEthereumAddress, getPublicKey } from '../../utils/storageUtil';
import { nextAPi } from '../../utils/axiosUtil';
  const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

  const [survey, setSurvey] =  useState(['']);
  const [textFields, setTextFields] = useState(['']); // 초기 텍스트 필드 배열

    const handleTextFieldChange = (index, event) => {
      const updatedTextFields = [...textFields];
      updatedTextFields[index] = event.target.value;
      setTextFields(updatedTextFields);
    };

    const submitSurveyAnswer = async (e) => {
      e.preventDefault();

      const serveyAnswer =[];




      for (let i = 0; i < textFields.length; i++) {
        console.log(survey[i]);
        serveyAnswer.push({
          surveyDetailId: survey[i].survey_detail_id,
          answer: textFields[i]
        })

      }
      console.log(serveyAnswer)

      const  surveyId = survey[0].survey_id;
      const surveyData=  {
        serveyAnswer: serveyAnswer,
        avatar: getAvatar(),
        ethereumAddress:getEthereumAddress()
      }

      const response = await nextAPi.post(`surveys/${surveyId}/answer`, surveyData);
      router.push('/survey/list');

    }
    const back = () => {
      router.back();
    }

    useEffect(() => {
      async function fetchData() {
        if (id) {
        const avatar = getAvatar()
          const response = await nextAPi.get(`surveys/${id}/${avatar}`);
          setSurvey(response.data);
        }
      }
      fetchData();
    }, [])

    return (
    <>
      <Head>
        <title>
          Settings
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">
              {survey && survey[0].title}
            </Typography>
            <Card>
              <CardHeader
                title="SURVEY"
              />
              <Divider />
              <CardContent>
                <Stack
                  spacing={3}
                >

                  {survey && survey.map((survey,index) => (
                  <>
                  {index + 1}. {survey.question}
                    <TextField
                    sx={{mt:1}}
                      key={index}
                      fullWidth
                      label={survey.question}
                      name="title"
                      onChange={(e) => handleTextFieldChange(index, e)}
                      type="text"
                      value={survey.answer===undefined ? textFields[index] : survey.answer  }
                    />
                    </>
                  ))

                  }

                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                {survey[0].answer===null ?   <Button variant="contained" onClick={submitSurveyAnswer}>
                  Request
                </Button>:
                  <Button variant="contained" onClick={back}>
                    Back
                  </Button>}


              </CardActions>
            </Card>
          </Stack>
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
  