import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { LoginPage } from './app/pages/LoginPage';
import { BrandsPage } from './app/pages/BrandsPage';
import { BrandPage } from './app/pages/BrandPage';
import { AboutPage } from './app/pages/AboutPage';
import { HowItWorksPage } from './app/pages/HowItWorksPage';
import { SubmitBrandPage } from './app/pages/SubmitBrandPage';
import { ContactPage } from './app/pages/ContactPage';
import { PrivacyPage } from './app/pages/PrivacyPage';
import { TermsPage } from './app/pages/TermsPage';
import { LEAD_SUBMITTED_KEY } from './lib/leadGate';
import './styles/index.css';

function RequireLead({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem(LEAD_SUBMITTED_KEY) !== '1') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/brands',
    element: (
      <RequireLead>
        <BrandsPage />
      </RequireLead>
    ),
  },
  {
    path: '/brand/:id',
    element: (
      <RequireLead>
        <BrandPage />
      </RequireLead>
    ),
  },
  { path: '/offers', element: <Navigate to="/brands" replace /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/how-it-works', element: <HowItWorksPage /> },
  { path: '/submit-a-brand', element: <SubmitBrandPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
