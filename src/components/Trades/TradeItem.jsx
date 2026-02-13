// src/components/Trades/TradeItem.jsx
import React from 'react';
import { Trash2, Clock, TrendingUp, TrendingDown, User, Edit2 } from 'lucide-react';

const TradeItem = ({ trade, deleteTrade, onEdit }) => {
  const isWin = (trade.pips || 0) > 0;
  
  const handleDelete = () => {
    if (window.confirm('Sigur vrei să ștergi acest trade?')) {
      deleteTrade(trade.id);
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 hover:bg-white/50 transition-all duration-200">
      {/* Layout pentru Mobile - Lista compactă */}
      <div className="block md:hidden space-y-1.5">
        {/* Linia 1: Paritate, Rezultat, Pips */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">{trade.pair}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              isWin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isWin ? 'TP' : 'SL'}
            </span>
          </div>
          <div className={`text-lg font-bold ${
            isWin ? 'text-green-600' : 'text-red-600'
          }`}>
            {isWin ? '+' : ''}{(trade.pips || 0).toFixed(1)}
          </div>
        </div>

        {/* Linia 2: Mentor, Sesiune, Edit, Delete */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className="font-medium">{trade.mentor}</span>
            <span className="text-gray-400">•</span>
            <span>{trade.session}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(trade)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Editează trade"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Șterge trade"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Notes */}
        {trade.notes && (
          <div className="text-xs text-gray-600 italic pt-0.5">
            "{trade.notes}"
          </div>
        )}
      </div>

      {/* Layout pentru Desktop/Tablet - Rândul original */}
      <div className="hidden md:flex flex-row items-center justify-between gap-0">
        {/* Info principală */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-6 w-auto">
          {/* Mentor */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 rounded-lg">
            <User className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-sm text-gray-900">{trade.mentor}</span>
          </div>

          {/* Paritate */}
          <div className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {trade.pair}
          </div>

          {/* Sesiune */}
          <div className="flex items-center space-x-1 bg-gray-100/80 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">{trade.session}</span>
          </div>

          {/* Rezultat */}
          <div className={`flex items-center space-x-1 px-4 py-1.5 rounded-xl text-sm font-bold shadow-md ${
            isWin 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
          }`}>
            {isWin ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>TP</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4" />
                <span>SL</span>
              </>
            )}
          </div>

          {/* Pips */}
          <div className={`text-2xl font-extrabold ${
            isWin ? 'text-green-600' : 'text-red-600'
          }`}>
            {isWin ? '+' : ''}{(trade.pips || 0).toFixed(1)} pips
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 w-auto">
          {trade.notes && (
            <div className="max-w-xs bg-blue-50/80 px-3 py-1.5 rounded-lg">
              <p className="text-sm text-blue-800 italic truncate font-medium">"{trade.notes}"</p>
            </div>
          )}
          
          <button
            onClick={() => onEdit(trade)}
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md flex-shrink-0"
            title="Editează trade"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md flex-shrink-0"
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
