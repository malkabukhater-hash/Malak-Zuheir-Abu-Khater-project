/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { EyeComfortProvider, useEyeComfort } from './context/EyeComfortContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { TwentyTwentyModal } from './components/common/TwentyTwentyModal';
import { SoftVoiceBar } from './components/common/SoftVoiceBar';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WaselMarketplacePage } from './pages/WaselMarketplacePage';
import { AounRepairPage } from './pages/AounRepairPage';
import { DefaShelterPage } from './pages/DefaShelterPage';
import { QatraWaterPage } from './pages/QatraWaterPage';
import { MaharaSkillsPage } from './pages/MaharaSkillsPage';
import { SmartRequestPage } from './pages/SmartRequestPage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { MediaCenterPage } from './pages/MediaCenterPage';
import { EyeCarePage } from './pages/EyeCarePage';
import { UserDashboard } from './pages/dashboards/UserDashboard';
import { MerchantDashboard } from './pages/dashboards/MerchantDashboard';
import { ProviderDashboard } from './pages/dashboards/ProviderDashboard';
import { OrganizationDashboard } from './pages/dashboards/OrganizationDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

function AppContent() {
  const [activePage, setActivePage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>(null);
  const { settings } = useEyeComfort();

  // Scroll to top on navigation
  const handleNavigate = (page: string, params?: any) => {
    setActivePage(page);
    setNavParams(params || null);
    window.scrollTo({ top: 0, behavior: settings.reducedMotion ? 'auto' : 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'wasel':
        return <WaselMarketplacePage onNavigate={handleNavigate} />;
      case 'aoun':
        return <AounRepairPage onNavigate={handleNavigate} />;
      case 'defa':
        return <DefaShelterPage onNavigate={handleNavigate} />;
      case 'qatra':
        return <QatraWaterPage onNavigate={handleNavigate} />;
      case 'mahara':
        return <MaharaSkillsPage onNavigate={handleNavigate} />;
      case 'request':
        return <SmartRequestPage onNavigate={handleNavigate} initialParams={navParams} />;
      case 'map':
        return <CommunityMapPage onNavigate={handleNavigate} initialFilter={navParams?.filter} />;
      case 'media':
        return <MediaCenterPage />;
      case 'eyecare':
        return <EyeCarePage />;
      case 'dashboard-user':
        return <UserDashboard onNavigate={handleNavigate} />;
      case 'dashboard-merchant':
        return <MerchantDashboard onNavigate={handleNavigate} />;
      case 'dashboard-provider':
        return <ProviderDashboard onNavigate={handleNavigate} />;
      case 'dashboard-org':
        return <OrganizationDashboard onNavigate={handleNavigate} />;
      case 'dashboard-admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${settings.readingFocus ? 'reading-focus-active' : ''}`}>
      {/* Global Accessibility 20-20-20 Break Modal */}
      <TwentyTwentyModal />

      {/* Soft Voice Reading Floating Bar */}
      <SoftVoiceBar />

      {/* Global Connectivity Banner */}
      <OfflineIndicator />

      {/* Navigation Header */}
      <Header activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content View */}
      <main className="flex-1 pb-12">
        {renderPage()}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <EyeComfortProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </EyeComfortProvider>
    </LanguageProvider>
  );
}
