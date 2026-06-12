import LoginScreen from '../components/LoginScreen.js';
import PageShell from '../components/PageShell.js';

function LoginFilledPage() {
  return (
    <PageShell title="Login (2)">
      <LoginScreen variant="filled" />
    </PageShell>
  );
}

export default LoginFilledPage;
