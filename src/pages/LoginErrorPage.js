import LoginScreen from '../components/LoginScreen.js';
import PageShell from '../components/PageShell.js';

function LoginErrorPage() {
  return (
    <PageShell title="Login (3)">
      <LoginScreen variant="error" />
    </PageShell>
  );
}

export default LoginErrorPage;
