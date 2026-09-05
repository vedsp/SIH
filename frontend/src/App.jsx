import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UploadModal } from './components/UploadModal';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { RiskPage } from './pages/RiskPage';
import { AssistantPage } from './pages/AssistantPage';
import { ReportsPage } from './pages/ReportsPage';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // login or register
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [documentCategory, setDocumentCategory] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono">Initializing FinDocAI Environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const handleViewDetail = (docId) => {
    setSelectedDocId(docId);
    setActiveTab('document_detail');
  };

  const handleDemoLoaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
      <Navbar onDemoLoaded={handleDemoLoaded} refreshTrigger={refreshTrigger} />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'document_detail') setSelectedDocId(null);
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onSelectCategory={(category) => setDocumentCategory(category)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setActiveTab}
              onOpenUpload={() => setIsUploadOpen(true)}
              onViewDetail={handleViewDetail}
              refreshTrigger={refreshTrigger}
              initialCategory={documentCategory}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsPage
              onOpenUpload={() => setIsUploadOpen(true)}
              onViewDetail={handleViewDetail}
              refreshTrigger={refreshTrigger}
              initialCategory={documentCategory}
            />
          )}

          {activeTab === 'document_detail' && (
            <DocumentDetailPage
              documentId={selectedDocId}
              onBack={() => setActiveTab('documents')}
            />
          )}

          {activeTab === 'verification' && <AnalysisPage />}
          {activeTab === 'anomalies' && <AnomaliesPage />}
          {activeTab === 'risk' && <RiskPage />}
          {activeTab === 'assistant' && <AssistantPage />}
          {activeTab === 'reports' && <ReportsPage />}
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
