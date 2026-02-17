import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ContextHeader from './components/ContextHeader';
import Navigation from './components/Navigation';
import PlaceholderPage from './components/PlaceholderPage';
import WorkspaceLayout from './components/WorkspaceLayout';
import SecondaryPanel from './components/SecondaryPanel';
import DesignSystemDemo from './components/DesignSystemDemo';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import Saved from './components/Saved';

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
                primary={<PlaceholderPage title="Daily Digest" />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/settings" element={
              <WorkspaceLayout
                primary={<PlaceholderPage title="Settings" />}
                secondary={<SecondaryPanel />}
              />
            } />

            <Route path="/proof" element={
              <WorkspaceLayout
                primary={<PlaceholderPage title="Proof of Work" />}
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
