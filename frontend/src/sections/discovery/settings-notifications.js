import { useCallback } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import { nextAPi } from 'src/utils/axiosUtil';
import { getAvatar } from 'src/utils/storageUtil';


export const SettingsNotifications = () => {

const [surveys, setSurveys] = useState([]);

useEffect(() => {
  getSurveys()
},[])

const getSurveys = async () => {
  const response = await nextAPi.get(`surveys`);
  setSurveys(response.data);
}
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

const buySurvey = async() => {
  const buydata = {
    avatar:getAvatar(),
    surveyId:1
  }

  const gistResponse = await nextAPi.post('surveys/buy',buydata)
}

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Select survey"
          title="Need category"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              xs={12}
              sm={6}
              md={4}
            >
              <Stack spacing={1}>
                <Typography variant="h6">
                  Surveys
                </Typography>
                <Stack>
                  {surveys && surveys.map((item) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox />}
                        label={item.title}
                        key={item.id}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={buySurvey}>
            Get
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
