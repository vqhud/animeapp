import EmptyStateScreen from '../components/EmptyStateScreen.js';
import PageShell from '../components/PageShell.js';

function NoWifiPage() {
  return (
    <PageShell title="Mất kết nối">
      <EmptyStateScreen type="wifi" title="Không có kết nối Wifi" message="Vui lòng kiểm tra lại kết nối wifi của bạn." />
    </PageShell>
  );
}

export default NoWifiPage;
