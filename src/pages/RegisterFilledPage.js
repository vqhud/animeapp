import RegisterScreen from '../components/RegisterScreen.js';
import PageShell from '../components/PageShell.js';

function RegisterFilledPage() {
  return (
    <PageShell title="register">
      <RegisterScreen variant="filled" />
    </PageShell>
  );
}

export default RegisterFilledPage;
