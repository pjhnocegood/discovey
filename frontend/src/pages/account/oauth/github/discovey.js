import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Page from '../../../index';

const OauthPage = () => (
  <>
    <>
      <Page oauth='discovey'></Page>
    </>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default OauthPage;


