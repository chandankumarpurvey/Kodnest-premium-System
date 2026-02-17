import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ContextHeader from './components/ContextHeader';
import Navigation from './components/Navigation';
import Digest from './components/Digest';
import WorkspaceLayout from './components/WorkspaceLayout';
import SecondaryPanel from './components/SecondaryPanel';
import DesignSystemDemo from './components/DesignSystemDemo';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import Saved from './components/Saved';
import Settings from './components/Settings';
import PlaceholderPage from './components/PlaceholderPage';
import TestChecklist from './components/TestChecklist';
import ShipPage from './components/ShipPage';
import ProofPage from './components/ProofPage';

function App() {
  return (
    <Router>
      <Layout step={2} totalSteps={5} status="Route Shell">

        <ContextHeader
          title="Job Notification Tracker"
          description="Track application updates, manage saved jobs, and configure notification preferences."
        />

        <Navigation />

        <div className="route-content mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={
              <WorkspaceLayout
                primary={<Dashboard />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/saved" element={
              <WorkspaceLayout
                primary={<Saved />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/digest" element={
              <WorkspaceLayout
                primary={<Digest />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/settings" element={
              <WorkspaceLayout
                primary={<Settings />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/jt/proof" element={
              <WorkspaceLayout
                primary={<ProofPage />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/proof" element={
              <WorkspaceLayout
                primary={<ProofPage />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/jt/07-test" element={
              <WorkspaceLayout
                primary={<TestChecklist />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/jt/08-ship" element={
              <WorkspaceLayout
                primary={<ShipPage />}
                secondary={<SecondaryPanel />}
              />
            } />

            {/* Keeping the original demo accessible for reference */}
            <Route path="/demo" element={
              <WorkspaceLayout
                primary={<DesignSystemDemo />}
                secondary={<SecondaryPanel />}
              />
            } />

            {/* Catch-all for 404 */}
            <Route path="*" element={
              <WorkspaceLayout
                primary={<NotFound />}
                secondary={<SecondaryPanel />}
              />
            } />

          </Routes>
        </div>

      </Layout>
    </Router>
  );
}

export default App;
