// src/components/Dashboard/Stats.jsx
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Users,
  Clock,
  Award,
  BarChart3,
  Download
} from 'lucide-react';
import { 
  calculateMonthlyStats, 
  calculateMentorStats, 
  calculateSessionStats,
  getDailyStats 
} from '../../utlis/calculations';
import { generateMonthlyPDF } from '../../utlis/pdfGenerator';

const Stats = ({ trades }) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // Calculează statisticile
  const monthlyStats = useMemo(
    () => calculateMonthlyStats(trades, selectedYear, selectedMonth),
    [trades, selectedYear, selectedMonth]
  );

  const mentorStats = useMemo(
    () => calculateMentorStats(trades, selectedYear, selectedMonth),
    [trades, selectedYear, selectedMonth]
  );

  const sessionStats = useMemo(
    () => calculateSessionStats(trades, selectedYear, selectedMonth),
    [trades, selectedYear, selectedMonth]
  );

  const dailyStats = useMemo(
    () => getDailyStats(trades, selectedYear, selectedMonth),
    [trades, selectedYear, selectedMonth]
  );

  // Lista lunilor pentru selector
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

  const handleDownloadPDF = () => {
    generateMonthlyPDF(trades, selectedYear, selectedMonth);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Selector Luna/An */}
      <div className="glass-card-strong rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
            Selectează Perioada
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
            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Descarcă PDF</span>
              <span className="xs:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistici Generale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Pips Câștigați"
          value={`+${monthlyStats.totalPipsWon}`}
          icon={<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />}
          color="green"
        />
        <StatCard
          title="Total Pips Pierduți"
          value={`-${monthlyStats.totalPipsLost}`}
          icon={<TrendingDown className="h-6 w-6 sm:h-8 sm:w-8" />}
          color="red"
        />
        <StatCard
          title="Pips Net"
          value={monthlyStats.netPips > 0 ? `+${monthlyStats.netPips}` : monthlyStats.netPips}
          icon={<Target className="h-6 w-6 sm:h-8 sm:w-8" />}
          color={monthlyStats.netPips >= 0 ? "green" : "red"}
        />
        <StatCard
          title="Win Rate"
          value={`${monthlyStats.winRate}%`}
          icon={<Award className="h-6 w-6 sm:h-8 sm:w-8" />}
          color={monthlyStats.winRate >= 50 ? "green" : "red"}
          subtitle={`${monthlyStats.totalWins}W / ${monthlyStats.totalLosses}L`}
        />
      </div>

      {/* Statistici per Mentor */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
          Statistici per Mentor
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Mentor</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Tradeuri</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Wins</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Losses</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Win Rate</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Total Pips</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorStats.map((stat, index) => (
                    <tr key={stat.mentor} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">{stat.mentor}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-600 text-xs sm:text-sm">{stat.total}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-green-600 font-medium text-xs sm:text-sm">{stat.wins}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-red-600 font-medium text-xs sm:text-sm">{stat.losses}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm">
                        <span className={`font-medium ${stat.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.winRate}%
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm">
                        <span className={`font-bold ${stat.totalPips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.totalPips > 0 ? '+' : ''}{stat.totalPips}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Statistici per Sesiune */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
          Statistici per Sesiune
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sessionStats.map(stat => (
            <div key={stat.session} className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{stat.session}</h4>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tradeuri:</span>
                  <span className="font-medium">{stat.total}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Win Rate:</span>
                  <span className={`font-medium ${stat.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.winRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Total:</span>
                  <span className={`font-bold text-base sm:text-lg ${stat.totalPips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.totalPips > 0 ? '+' : ''}{stat.totalPips}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Zilnic */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
          Performanță Zilnică
        </h3>
        {dailyStats.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5 sm:gap-2">
            {dailyStats.map(day => (
              <div
                key={day.date}
                className={`p-2 sm:p-3 rounded-lg border-2 ${
                  day.isPositive 
                    ? 'border-green-500 bg-green-50' 
                    : day.isNegative 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-xs text-gray-600 mb-1">
                  {new Date(day.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                </div>
                <div className={`text-base sm:text-lg font-bold ${
                  day.isPositive ? 'text-green-600' : day.isNegative ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {day.totalPips > 0 ? '+' : ''}{day.totalPips}
                </div>
                <div className="text-xs text-gray-500">
                  {day.wins}W / {day.losses}L
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">Nu există tradeuri pentru această lună.</p>
        )}
      </div>
    </div>
  );
};

// Componentă card pentru statistici
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    green: 'from-green-400 to-emerald-500',
    red: 'from-red-400 to-rose-500',
    blue: 'from-blue-400 to-purple-500'
  };

  return (
    <div className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-white/90">{title}</h3>
        <div className="text-white">{icon}</div>
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-white">{value}</p>
      {subtitle && <p className="text-xs sm:text-sm text-white/80 font-medium">{subtitle}</p>}
    </div>
  );
};

export default Stats;
