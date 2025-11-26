import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import LoadingOverlay from './components/LoadingOverlay'
import Header from './components/Header'
import OfflineIndicator from './components/OfflineIndicator'

type AuthMode = 'login' | 'signup';

function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    if (authMode === 'login') {
      return (
        <>
          <OfflineIndicator />
          <Login onSwitchToSignUp={() => setAuthMode('signup')} />
        </>
      );
    }
    return (
      <>
        <OfflineIndicator />
        <SignUp onSwitchToLogin={() => setAuthMode('login')} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <OfflineIndicator />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;