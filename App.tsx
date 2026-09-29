import { ThemeProvider } from '@/context/ThemeContext';
import { NavProvider, useNav, type Page } from '@/context/NavContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import BoardPage from '@/pages/BoardPage';
import DonorPage from '@/pages/DonorPage';
import NGOPage from '@/pages/NGOPage';
import AdminPage from '@/pages/AdminPage';
import VolunteerPage from '@/pages/VolunteerPage';
import LoginPage from '@/pages/LoginPage';

function PageRouter() {
  const { page } = useNav();
  switch (page) {
    case 'home': return <HomePage />;
    case 'board': return <BoardPage />;
    case 'donor': return <DonorPage />;
    case 'ngo': return <NGOPage />;
    case 'volunteer': return <VolunteerPage />;
    case 'admin': return <AdminPage />;
    default: return <HomePage />;
  }
}

function AppContent() {
  const { page, navigate } = useNav();
  const { user } = useAuth();

  // Login page shows full-screen (no header/footer)
  if (page === 'login') return <LoginPage />;

  // All pages require login
  if (!user) {
    return <LoginPage />;
  }

  // Role-based access: redirect if wrong role
  const rolePageMap: Record<string, Page> = {
    donor: 'donor',
    ngo: 'ngo',
    volunteer: 'volunteer',
    admin: 'admin',
  };

  const allowedPage = rolePageMap[user.role];
  if (page !== 'home' && page !== 'board' && page !== allowedPage) {
    navigate(allowedPage, user.role);
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-teal-950 transition-colors">
      <Header />
      <main className="flex-1">
        <PageRouter />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavProvider>
            <AppContent />
          </NavProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
