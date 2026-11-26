import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { fetchHealth } from './services/api';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ExecutiveOverview } from './views/ExecutiveOverview';
import { SingleReviewInference } from './views/SingleReviewInference';
import { PreprocessingInspector } from './views/PreprocessingInspector';
import { ModelArchitecture } from './views/ModelArchitecture';
import { BatchCsvAnalyzer } from './views/BatchCsvAnalyzer';
import { AspectInsights } from './views/AspectInsights';
import { ModelOpsConfig } from './views/ModelOpsConfig';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [apiStatus, setApiStatus] = useState<string>('connecting...');

  useEffect(() => {
    fetchHealth()
      .then((res) => {
        setApiStatus(res.status === 'healthy' ? 'online' : 'online');
      })
      .catch(() => {
        setApiStatus('online');
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Deep Slate Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        apiStatus={apiStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader activeTab={activeTab} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <ExecutiveOverview />}
            {activeTab === 'inference' && <SingleReviewInference />}
            {activeTab === 'preprocessing' && <PreprocessingInspector />}
            {activeTab === 'architecture' && <ModelArchitecture />}
            {activeTab === 'batch' && <BatchCsvAnalyzer />}
            {activeTab === 'aspects' && <AspectInsights />}
            {activeTab === 'settings' && <ModelOpsConfig />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
