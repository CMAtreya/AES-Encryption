import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { EncryptionVisualizer } from './pages/EncryptionVisualizer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'visualizer'>('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">SV</span>
            </div>
            <h1 className="text-xl font-bold">SecureVault AI</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md transition ${
                currentView === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('visualizer')}
              className={`px-4 py-2 rounded-md transition ${
                currentView === 'visualizer'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              Encryption Visualizer
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' ? <Dashboard /> : <EncryptionVisualizer />}
      </main>
    </div>
  );
}

export default App;
