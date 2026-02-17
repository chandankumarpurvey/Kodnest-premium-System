import React from 'react';
import Layout from './components/Layout';
import ContextHeader from './components/ContextHeader';
import WorkspaceLayout from './components/WorkspaceLayout';
import SecondaryPanel from './components/SecondaryPanel';
import DesignSystemDemo from './components/DesignSystemDemo';

function App() {
  return (
    <Layout step={1} totalSteps={5} status="In Progress">

      <ContextHeader
        title="Design System Overview"
        description="A calm, intentional, and confident design system for premium B2C products. No noise, just focus."
      />

      <WorkspaceLayout
        primary={<DesignSystemDemo />}
        secondary={<SecondaryPanel />}
      />

    </Layout>
  );
}

export default App;
