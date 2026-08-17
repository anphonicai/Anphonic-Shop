import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { BrandsPage } from './app/pages/BrandsPage';
import { BrandPage } from './app/pages/BrandPage';
import { AboutPage } from './app/pages/AboutPage';
import { HowItWorksPage } from './app/pages/HowItWorksPage';
import { SubmitBrandPage } from './app/pages/SubmitBrandPage';
import { ContactPage } from './app/pages/ContactPage';
import { PrivacyPage } from './app/pages/PrivacyPage';
import { TermsPage } from './app/pages/TermsPage';
import { BlogsPage } from './app/pages/BlogsPage';
import { BlogPostPage } from './app/pages/BlogPostPage';
import { AdminStatsPage } from './app/pages/AdminStatsPage';
import { trackPageview } from './lib/analytics';
import './styles/index.css';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/brands" replace /> },
  { path: '/brands', element: <BrandsPage /> },
  { path: '/brand/:id', element: <BrandPage /> },
  { path: '/offers', element: <Navigate to="/brands" replace /> },
  { path: '/blogs', element: <BlogsPage /> },
  { path: '/blogs/:slug', element: <BlogPostPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/how-it-works', element: <HowItWorksPage /> },
  { path: '/submit-a-brand', element: <SubmitBrandPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/admin/stats', element: <AdminStatsPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

// GA4 pageviews are sent manually (send_page_view: false in index.html)
// since react-router's client-side navigation never triggers a real page load.
let lastTrackedPath: string | null = null;
const trackCurrentRoute = () => {
  const { pathname, search } = router.state.location;
  const path = pathname + search;
  if (path === lastTrackedPath) return;
  lastTrackedPath = path;
  trackPageview(path);
};
router.subscribe(trackCurrentRoute);
trackCurrentRoute();

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
