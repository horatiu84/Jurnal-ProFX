// src/components/Trades/TradeItem.jsx
import React from 'react';
import { Trash2, Clock, TrendingUp, TrendingDown, User } from 'lucide-react';

const TradeItem = ({ trade, deleteTrade }) => {
  const isWin = (trade.pips || 0) > 0;
  
  const handleDelete = () => {
    if (window.confirm('Sigur vrei să ștergi acest trade?')) {
      deleteTrade(trade.id);
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hover:bg-white/50 transition-all duration-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
        {/* Info principală */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full md:w-auto">
          {/* Mentor */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            <span className="font-semibold text-xs sm:text-sm text-gray-900">{trade.mentor}</span>
          </div>

          {/* Paritate */}
          <div className="font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {trade.pair}
          </div>

          {/* Sesiune */}
          <div className="flex items-center space-x-1 bg-gray-100/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{trade.session}</span>
          </div>

          {/* Rezultat */}
          <div className={`flex items-center space-x-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-md ${
            isWin 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
          }`}>
            {isWin ? (
              <>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>TP</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>SL</span>
              </>
            )}
          </div>

          {/* Pips */}
          <div className={`text-xl sm:text-2xl md:text-2xl font-extrabold ${
            isWin ? 'text-green-600' : 'text-red-600'
          }`}>
            {isWin ? '+' : ''}{(trade.pips || 0).toFixed(1)} pips
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between md:justify-end space-x-2 sm:space-x-3 w-full md:w-auto">
          {trade.notes && (
            <div className="flex-1 md:max-w-xs bg-blue-50/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800 italic truncate font-medium">"{trade.notes}"</p>
            </div>
          )}
          
          <button
            onClick={handleDelete}
            className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md flex-shrink-0"
            title="Șterge trade"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeItem;
