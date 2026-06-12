import LoginScreen from '../components/LoginScreen.js';
import PageShell from '../components/PageShell.js';


const handleFacebookLogin = () => {
  window.location.href = "http://localhost:3001/api/auth/facebook";
};
function LoginPage() {
  return (
    <PageShell title="Login (1)">
      <LoginScreen />
    </PageShell>
  );
}

export default LoginPage;
