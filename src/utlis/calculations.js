// src/utlis/calculations.js

/**
 * Calculează statisticile pentru o lună specifică
 */
export const calculateMonthlyStats = (trades, year, month) => {
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  });

  const totalPipsWon = monthTrades
    .filter(t => (t.pips || 0) > 0)
    .reduce((sum, t) => sum + (t.pips || 0), 0);
  
  const totalPipsLost = monthTrades
    .filter(t => (t.pips || 0) < 0)
    .reduce((sum, t) => sum + Math.abs(t.pips || 0), 0);
  
  const netPips = totalPipsWon - totalPipsLost;
  
  const totalWins = monthTrades.filter(t => (t.pips || 0) > 0).length;
  const totalLosses = monthTrades.filter(t => (t.pips || 0) < 0).length;
  const totalTrades = monthTrades.length;
  
  const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;

  return {
    totalPipsWon: Math.round(totalPipsWon * 10) / 10,
    totalPipsLost: Math.round(totalPipsLost * 10) / 10,
    netPips: Math.round(netPips * 10) / 10,
    totalWins,
    totalLosses,
    totalTrades,
    winRate: Math.round(winRate * 10) / 10
  };
};

/**
 * Calculează statisticile per mentor pentru o lună
 */
export const calculateMentorStats = (trades, year, month) => {
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  });

  const mentors = ['Flavius', 'Mihai', 'Eli', 'Tudor', 'Daniel'];
  
  return mentors.map(mentor => {
    const mentorTrades = monthTrades.filter(t => t.mentor === mentor);
    
    const totalPips = mentorTrades.reduce((sum, t) => sum + (t.pips || 0), 0);
    const wins = mentorTrades.filter(t => (t.pips || 0) > 0).length;
    const losses = mentorTrades.filter(t => (t.pips || 0) < 0).length;
    const total = mentorTrades.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      mentor,
      totalPips: Math.round(totalPips * 10) / 10,
      wins,
      losses,
      total,
      winRate: Math.round(winRate * 10) / 10
    };
  });
};

/**
 * Calculează statisticile per sesiune pentru o lună
 */
export const calculateSessionStats = (trades, year, month) => {
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  });

  const sessions = ['Asia', 'Londra', 'New York'];
  
  return sessions.map(session => {
    const sessionTrades = monthTrades.filter(t => t.session === session);
    
    const totalPips = sessionTrades.reduce((sum, t) => sum + (t.pips || 0), 0);
    const wins = sessionTrades.filter(t => (t.pips || 0) > 0).length;
    const losses = sessionTrades.filter(t => (t.pips || 0) < 0).length;
    const total = sessionTrades.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      session,
      totalPips: Math.round(totalPips * 10) / 10,
      wins,
      losses,
      total,
      winRate: Math.round(winRate * 10) / 10
    };
  });
};

/**
 * Obține lista zilelor pentru o lună
 */
export const getDailyStats = (trades, year, month) => {
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  });

  // Grupează pe zile
  const dailyGroups = monthTrades.reduce((acc, trade) => {
    const date = trade.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  // Calculează statisticile pentru fiecare zi
  return Object.entries(dailyGroups).map(([date, dayTrades]) => {
    const totalPips = dayTrades.reduce((sum, t) => sum + (t.pips || 0), 0);
    const wins = dayTrades.filter(t => (t.pips || 0) > 0).length;
    const losses = dayTrades.filter(t => (t.pips || 0) < 0).length;
    
    return {
      date,
      totalPips: Math.round(totalPips * 10) / 10,
      wins,
      losses,
      total: dayTrades.length,
      isPositive: totalPips > 0,
      isNegative: totalPips < 0
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Obține lista lunilor disponibile din tradeuri
 */
export const getAvailableMonths = (trades) => {
  const months = new Set();
  
  trades.forEach(trade => {
    const date = new Date(trade.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    months.add(key);
  });

  return Array.from(months)
    .map(key => {
      const [year, month] = key.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
};
