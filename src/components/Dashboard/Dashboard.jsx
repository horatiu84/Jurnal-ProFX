// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { Plus, BarChart3, List } from 'lucide-react';
import TradeForm from '../Trades/TradeForm';
import TradeList from '../Trades/TradeList';
import Stats from './Stats';
import { useTrades } from '../../hooks/useTrades';

const Dashboard = () => {
  const { trades, loading, addTrade, deleteTrade } = useTrades();
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [activeTab, setActiveTab] = useState('trades'); // 'trades' or 'stats'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const handleTradeAdded = () => {
    setShowTradeForm(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 gap-3 sm:gap-0">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Trading Journal ProFX
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Jurnal pentru Mentorii ProFX</p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => setShowTradeForm(true)}
                className="inline-flex items-center justify-center flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Adaugă Trade</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 sm:space-x-8 border-t border-white/30 pt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('trades')}
              className={`pb-3 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'trades'
                  ? 'border-purple-600 text-purple-600 scale-105'
                  : 'border-transparent text-gray-600 hover:text-purple-500 hover:border-purple-300'
              }`}
            >
              <List className="h-4 w-4 inline mr-1 sm:mr-2" />
              Tradeuri
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-3 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-purple-600 text-purple-600 scale-105'
                  : 'border-transparent text-gray-600 hover:text-purple-500 hover:border-purple-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-1 sm:mr-2" />
              Statistici
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        {activeTab === 'trades' ? (
          <TradeList trades={trades} deleteTrade={deleteTrade} />
        ) : (
          <Stats trades={trades} />
        )}
      </main>

      {/* Trade Form Modal */}
      {showTradeForm && (
        <TradeForm 
          onClose={() => setShowTradeForm(false)}
          onTradeAdded={handleTradeAdded}
          addTrade={addTrade}
        />
      )}
    </div>
  );
};

export default Dashboard;