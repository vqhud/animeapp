import RegisterScreen from '../components/RegisterScreen.js';
import PageShell from '../components/PageShell.js';

function RegisterErrorPage() {
  return (
    <PageShell title="register">
      <RegisterScreen variant="error" />
    </PageShell>
  );
}

export default RegisterErrorPage;
