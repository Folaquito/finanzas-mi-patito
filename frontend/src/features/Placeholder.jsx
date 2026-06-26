import Patito from '../components/Patito';
import Shell from '../components/Shell';
import { Card } from '../components/ui';
import { useAuth } from '../context/auth-context';
import { toShellUser } from '../utils/user';

export default function Placeholder({ active, title, onNavigate }) {
  const { user } = useAuth();
  return (
    <Shell active={active} user={toShellUser(user)} title={title} onNavigate={onNavigate}>
      <Card className="state" style={{ textAlign: 'center', padding: '48px' }}>
        <Patito size={90} stage={2} mood="content" />
        <p style={{ marginTop: 16 }}>Esta sección está en construcción 🛠️</p>
      </Card>
    </Shell>
  );
}
