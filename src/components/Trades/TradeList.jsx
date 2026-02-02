// src/components/Trades/TradeList.jsx
import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import TradeItem from './TradeItem';

const TradeList = ({ trades, deleteTrade }) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // Lista lunilor
  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  // Generează lista de ani disponibili
  const availableYears = useMemo(() => {
    const years = new Set();
    // Adaugă anul curent întotdeauna
    years.add(currentDate.getFullYear());
    trades.forEach(trade => {
      const year = new Date(trade.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [trades]);

  // Filtrează tradeurile pentru luna selectată
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getFullYear() === selectedYear && tradeDate.getMonth() === selectedMonth;
    });
  }, [trades, selectedYear, selectedMonth]);

  if (!trades || trades.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <p className="text-gray-700 text-lg font-semibold">Nu există tradeuri înregistrate încă.</p>
        <p className="text-gray-500 mt-2">Apasă pe "Adaugă Trade" pentru a începe!</p>
      </div>
    );
  }

  // Functie pentru sortarea dupa sesiune (Asia, Londra, New York)
  const getSessionOrder = (session) => {
    const order = { 'Asia': 1, 'Londra': 2, 'New York': 3 };
    return order[session] || 999;
  };
  
  // Grupează tradeurile pe zile
  const groupedTrades = filteredTrades.reduce((acc, trade) => {
    const date = trade.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});
  
  // Sorteaza tradeurile din fiecare zi dupa sesiune si apoi dupa timestamp
  Object.keys(groupedTrades).forEach(date => {
    groupedTrades[date].sort((a, b) => {
      const sessionDiff = getSessionOrder(a.session) - getSessionOrder(b.session);
      if (sessionDiff !== 0) return sessionDiff;
      // Daca sunt pe aceeasi sesiune, sorteaza dupa timestamp (ordinea introducerii)
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Selector Luna/An */}
      <div className="glass-card-strong rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
            Filtrează după Lună
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/80 border border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all text-sm sm:text-base"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 sm:px-4 py-2 bg-white/80 border border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all text-sm sm:text-base"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="text-xs sm:text-sm text-gray-700 font-semibold px-3 sm:px-4 py-2 bg-white/60 rounded-lg sm:rounded-xl whitespace-nowrap">
              {filteredTrades.length} trade{filteredTrades.length !== 1 ? 'uri' : ''}
            </div>
          </div>
        </div>
      </div>

      {filteredTrades.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-700 text-lg font-semibold">Nu există tradeuri pentru această lună.</p>
          <p className="text-gray-500 mt-2">Selectează o altă lună sau adaugă tradeuri noi.</p>
        </div>
      ) : (
        Object.entries(groupedTrades)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .map(([date, dayTrades]) => {
          // Calculează statisticile zilei
          const totalPips = dayTrades.reduce((sum, t) => sum + (t.pips || 0), 0);
          const wins = dayTrades.filter(t => (t.pips || 0) > 0).length;
          const losses = dayTrades.filter(t => (t.pips || 0) < 0).length;
          const totalWinPips = dayTrades.filter(t => (t.pips || 0) > 0).reduce((sum, t) => sum + t.pips, 0);
          const totalLossPips = Math.abs(dayTrades.filter(t => (t.pips || 0) < 0).reduce((sum, t) => sum + t.pips, 0));
          const netPips = totalWinPips - totalLossPips;
          const isPositiveDay = totalPips > 0;
          const isNegativeDay = totalPips < 0;

          return (
            <div key={date} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-2xl">
              {/* Header Zi */}
              <div className={`px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm ${
                isPositiveDay ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80' : 
                isNegativeDay ? 'bg-gradient-to-r from-red-50/80 to-rose-50/80' : 
                'bg-gradient-to-r from-gray-50/80 to-slate-50/80'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {new Date(date).toLocaleDateString('ro-RO', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  <div className={`text-right ${
                    isPositiveDay ? 'text-green-600' : 
                    isNegativeDay ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {totalPips > 0 ? '+' : ''}{totalPips.toFixed(1)}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold">pips total</p>
                  </div>
                </div>
              </div>

              {/* Lista tradeuri */}
              <div className="divide-y divide-gray-200/50">
                {dayTrades.map(trade => (
                  <TradeItem key={trade.id} trade={trade} deleteTrade={deleteTrade} />
                ))}
              </div>

              {/* Statistici detaliate */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-gray-50/50 to-slate-50/50 border-t border-gray-200/50">
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 font-medium mb-1">Total Trades</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dayTrades.length}</p>
                </div>
                <div className="bg-green-50/80 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-green-700 font-medium mb-1">Câștigate (TP)</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{wins}</p>
                  <p className="text-xs text-green-600 font-semibold">+{totalWinPips.toFixed(1)} pips</p>
                </div>
                <div className="bg-red-50/80 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-red-700 font-medium mb-1">Pierdute (SL)</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{losses}</p>
                  <p className="text-xs text-red-600 font-semibold">-{totalLossPips.toFixed(1)} pips</p>
                </div>
                <div className={`rounded-lg p-2 sm:p-3 ${
                  netPips >= 0 ? 'bg-emerald-100/80' : 'bg-rose-100/80'
                }`}>
                  <p className="text-xs text-gray-700 font-medium mb-1">Pips Net</p>
                  <p className={`text-xl sm:text-2xl font-bold ${
                    netPips >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {netPips > 0 ? '+' : ''}{netPips.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">profit - pierdere</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TradeList;
