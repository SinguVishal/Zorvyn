import React, { useState } from 'react';
import Layout from './components/Layout';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      case 'contact':
        return <Contact />;
      default:
        return <Overview />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <ChatBot setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
