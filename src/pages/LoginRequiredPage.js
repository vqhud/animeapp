import EmptyStateScreen from '../components/EmptyStateScreen.js';
import PageShell from '../components/PageShell.js';

function LoginRequiredPage() {
  return (
    <PageShell title="Đăng nhập để xem thông tin">
      <EmptyStateScreen type="login" title="Hãy đăng nhập" message="Vui lòng đăng nhập để tiếp tục xem thông tin." />
    </PageShell>
  );
}

export default LoginRequiredPage;
