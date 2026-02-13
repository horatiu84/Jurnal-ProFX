// src/components/Trades/TradeForm.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const TradeForm = ({ onClose, onTradeAdded, addTrade, updateTrade, editingTrade }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState(() => {
    if (editingTrade) {
      // When editing, populate form with existing trade data
      return {
        date: editingTrade.date,
        mentor: editingTrade.mentor,
        pair: editingTrade.pair,
        session: editingTrade.session,
        result: (editingTrade.pips || 0) >= 0 ? 'TP' : 'SL',
        pips: Math.abs(editingTrade.pips || 0).toString(),
        notes: editingTrade.notes || ''
      };
    } else {
      // When adding, use default values
      return {
        date: new Date().toISOString().split('T')[0],
        mentor: 'Flavius',
        pair: '',
        session: '',
        result: 'TP',
        pips: '',
        notes: ''
      };
    }
  });

  const mentors = ['Flavius', 'Mihai', 'Eli', 'Tudor','Adrian', 'Daniel'];
  const sessions = ['Asia', 'Londra', 'New York'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convertește pips-urile la număr și aplică semnul corect în funcție de rezultat
      let pipsValue = Math.abs(parseFloat(formData.pips) || 0);
      
      // Dacă e SL, pips-urile trebuie să fie negative
      if (formData.result === 'SL') {
        pipsValue = -pipsValue;
      }
      
      const tradeData = {
        ...formData,
        pips: pipsValue,
        timestamp: editingTrade ? editingTrade.timestamp : new Date().toISOString()
      };

      if (editingTrade) {
        // Update existing trade
        await updateTrade(editingTrade.id, tradeData);
      } else {
        // Add new trade
        await addTrade(tradeData);
      }
      
      if (onTradeAdded) onTradeAdded();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Error saving trade:', error);
      setError('Eroare la salvarea trade-ului: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-screen overflow-y-auto my-4 sm:my-0">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {editingTrade ? 'Editează Trade' : 'Adaugă Trade Nou'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Data */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Data
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>

          {/* Mentor */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Mentor
            </label>
            <select
              value={formData.mentor}
              onChange={(e) => handleInputChange('mentor', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            >
              {mentors.map(mentor => (
                <option key={mentor} value={mentor}>{mentor}</option>
              ))}
            </select>
          </div>

          {/* Paritate */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Paritate (ex: EURUSD, GBPJPY)
            </label>
            <input
              type="text"
              value={formData.pair}
              onChange={(e) => handleInputChange('pair', e.target.value.toUpperCase())}
              placeholder="EURUSD"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm sm:text-base"
              required
            />
          </div>

          {/* Sesiune */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Sesiune <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {sessions.map(session => (
                <button
                  key={session}
                  type="button"
                  onClick={() => handleInputChange('session', session)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 font-medium transition-all text-sm sm:text-base ${
                    formData.session === session
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {session}
                </button>
              ))}
            </div>
            {!formData.session && (
              <p className="text-xs text-red-500 mt-1">Te rog selectează o sesiune</p>
            )}
          </div>

          {/* Rezultat */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Rezultat
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('result', 'TP')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 font-medium transition-all text-sm sm:text-base ${
                  formData.result === 'TP'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                ✓ Take Profit (TP)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('result', 'SL')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 font-medium transition-all text-sm sm:text-base ${
                  formData.result === 'SL'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                ✗ Stop Loss (SL)
              </button>
            </div>
          </div>

          {/* Pips */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Număr de Pips {formData.result === 'SL' ? '(introduce doar numărul, minus se pune automat)' : '(introduce doar numărul)'}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.pips}
              onChange={(e) => handleInputChange('pips', e.target.value)}
              placeholder={formData.result === 'TP' ? '50' : '20'}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Note (opțional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Adaugă detalii despre trade..."
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm sm:text-base order-2 sm:order-1"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading || !formData.session}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
            >
              {loading ? 'Se salvează...' : (editingTrade ? 'Actualizează Trade' : 'Salvează Trade')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;
