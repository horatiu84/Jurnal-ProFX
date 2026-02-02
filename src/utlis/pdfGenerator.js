/* eslint-disable no-unused-vars */
// src/utlis/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateMonthlyStats, getDailyStats } from './calculations';

export const generateMonthlyPDF = (trades, year, month) => {
  const doc = new jsPDF();
  
  // Calculează statisticile
  const stats = calculateMonthlyStats(trades, year, month);
  const dailyStats = getDailyStats(trades, year, month);
  
  // Filtrează tradeurile pentru luna selectată
  const monthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];
  
  // Functie pentru eliminarea diacriticelor
  const removeDiacritics = (str) => {
    return str
      .replace(/ă/g, 'a')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/ș/g, 's')
      .replace(/ț/g, 't')
      .replace(/Ă/g, 'A')
      .replace(/Â/g, 'A')
      .replace(/Î/g, 'I')
      .replace(/Ș/g, 'S')
      .replace(/Ț/g, 'T');
  };
  
  // Functie pentru sortarea dupa sesiune (Asia, Londra, New York)
  const getSessionOrder = (session) => {
    const order = { 'Asia': 1, 'Londra': 2, 'New York': 3 };
    return order[session] || 999;
  };
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Trading Journal ProFX', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`${months[month]} ${year}`, 105, 30, { align: 'center' });
  
  // Linie separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  let yPosition = 45;
  
  // Tradeuri grupate pe zile
  const groupedByDate = monthTrades.reduce((acc, trade) => {
    if (!acc[trade.date]) acc[trade.date] = [];
    acc[trade.date].push(trade);
    return acc;
  }, {});
  
  // Sorteaza tradeurile din fiecare zi dupa sesiune si apoi dupa timestamp
  Object.keys(groupedByDate).forEach(date => {
    groupedByDate[date].sort((a, b) => {
      const sessionDiff = getSessionOrder(a.session) - getSessionOrder(b.session);
      if (sessionDiff !== 0) return sessionDiff;
      // Daca sunt pe aceeasi sesiune, sorteaza dupa timestamp (ordinea introducerii)
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  });
  
  Object.entries(groupedByDate).forEach(([date, dayTrades], index) => {
    // Verifică dacă mai avem loc pe pagină
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Salvează poziția de start a card-ului pentru zi
    const dayCardStartY = yPosition;
    
    // Header zi - calculează statistici
    const dayTotal = dayTrades.reduce((sum, t) => sum + (t.pips || 0), 0);
    const dayWins = dayTrades.filter(t => (t.pips || 0) > 0).length;
    const dayLosses = dayTrades.filter(t => (t.pips || 0) < 0).length;
    const dayColor = dayTotal > 0 ? [34, 197, 94] : dayTotal < 0 ? [239, 68, 68] : [100, 100, 100];
    
    // Mărește yPosition pentru padding
    yPosition += 5;
    
    doc.setFontSize(12);
    doc.setTextColor(...dayColor);
    doc.setFont(undefined, 'bold');
    
    const dateFormatted = new Date(date).toLocaleDateString('ro-RO', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
    
    // Prima linie: data și total pips (fara diacritice)
    const dateNoDiacritics = removeDiacritics(dateFormatted);
    doc.text(`${dateNoDiacritics} - ${dayTotal > 0 ? '+' : ''}${dayTotal.toFixed(1)} pips`, 105, yPosition, { align: 'center' });
    yPosition += 7;
    
    // Tabel tradeuri
    const tableData = dayTrades.map((trade, idx) => [
      idx + 1,
      trade.mentor,
      trade.pair,
      trade.session,
      trade.result,
      `${trade.pips > 0 ? '+' : ''}${trade.pips.toFixed(1)}`,
      trade.notes || '-'
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Mentor', 'Paritate', 'Sesiune', 'Rezultat', 'Pips', 'Note']],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: [59, 130, 246],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 8 
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
        6: { cellWidth: 40 }
      },
      didParseCell: function(data) {
        // Colorează coloana Pips
        if (data.column.index === 5 && data.section === 'body') {
          const trade = dayTrades[data.row.index];
          if (trade.pips > 0) {
            data.cell.styles.textColor = [34, 197, 94]; // Verde
          } else if (trade.pips < 0) {
            data.cell.styles.textColor = [239, 68, 68]; // Roșu
          }
        }
        // Colorează coloana Rezultat
        if (data.column.index === 4 && data.section === 'body') {
          const trade = dayTrades[data.row.index];
          if (trade.result === 'TP') {
            data.cell.styles.textColor = [34, 197, 94];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      tableWidth: 170,
      margin: { left: (210 - 170) / 2, right: (210 - 170) / 2 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 5;
    
    // Calculeaza pips pentru wins si losses
    const dayPipsWon = dayTrades.filter(t => (t.pips || 0) > 0).reduce((sum, t) => sum + t.pips, 0);
    const dayPipsLost = Math.abs(dayTrades.filter(t => (t.pips || 0) < 0).reduce((sum, t) => sum + t.pips, 0));
    
    // Card-uri statistici zilnice (similar cu webapp-ul)
    const cardWidth = 40;
    const cardHeight = 16;
    const spacing = 3;
    const totalCardsWidth = (cardWidth * 4) + (spacing * 3);
    const startX = (210 - totalCardsWidth) / 2;
    
    // Card 1: Total Tradeuri
    doc.setFillColor(240, 240, 245);
    doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(220, 220, 230);
    doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 2, 2, 'S');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Tradeuri', startX + 2, yPosition + 4);
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.setFont(undefined, 'bold');
    doc.text(dayTrades.length.toString(), startX + 2, yPosition + 11);
    
    // Card 2: Castigate (TP)
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(startX + cardWidth + spacing, yPosition, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(200, 240, 200);
    doc.roundedRect(startX + cardWidth + spacing, yPosition, cardWidth, cardHeight, 2, 2, 'S');
    doc.setFontSize(7);
    doc.setTextColor(34, 197, 94);
    doc.text('Castigate (TP)', startX + cardWidth + spacing + 2, yPosition + 4);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(dayWins.toString(), startX + cardWidth + spacing + 2, yPosition + 11);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(`+${dayPipsWon.toFixed(1)} pips`, startX + cardWidth + spacing + 2, yPosition + 14.5);
    
    // Card 3: Pierdute (SL)
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(startX + (cardWidth + spacing) * 2, yPosition, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(240, 200, 200);
    doc.roundedRect(startX + (cardWidth + spacing) * 2, yPosition, cardWidth, cardHeight, 2, 2, 'S');
    doc.setFontSize(7);
    doc.setTextColor(239, 68, 68);
    doc.text('Pierdute (SL)', startX + (cardWidth + spacing) * 2 + 2, yPosition + 4);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(dayLosses.toString(), startX + (cardWidth + spacing) * 2 + 2, yPosition + 11);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(`-${dayPipsLost.toFixed(1)} pips`, startX + (cardWidth + spacing) * 2 + 2, yPosition + 14.5);
    
    // Card 4: Pips Net
    const netBgColor = dayTotal >= 0 ? [240, 253, 244] : [254, 242, 242];
    const netBorderColor = dayTotal >= 0 ? [200, 240, 200] : [240, 200, 200];
    const netTextColor = dayTotal >= 0 ? [34, 197, 94] : [239, 68, 68];
    doc.setFillColor(...netBgColor);
    doc.roundedRect(startX + (cardWidth + spacing) * 3, yPosition, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(...netBorderColor);
    doc.roundedRect(startX + (cardWidth + spacing) * 3, yPosition, cardWidth, cardHeight, 2, 2, 'S');
    doc.setFontSize(7);
    doc.setTextColor(...netTextColor);
    doc.text('Pips Net', startX + (cardWidth + spacing) * 3 + 2, yPosition + 4);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`${dayTotal > 0 ? '+' : ''}${dayTotal.toFixed(1)}`, startX + (cardWidth + spacing) * 3 + 2, yPosition + 11);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(dayTotal >= 0 ? 'profit - pierdere' : 'pierdere - profit', startX + (cardWidth + spacing) * 3 + 2, yPosition + 14.5);
    
    yPosition += cardHeight + 5;
    
    // Desenează border în jurul întregii zile
    const dayCardHeight = yPosition - dayCardStartY;
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, dayCardStartY, 180, dayCardHeight, 3, 3, 'S');
    
    yPosition += 5;
  });
  
  // Adaugă o nouă pagină pentru statistici
  doc.addPage();
  yPosition = 20;
  
  // Titlu statistici
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold');
  doc.text('Statistici Lunare', 105, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Card-uri statistici principale
  const cardWidth = 85;
  const cardHeight = 20;
  const spacing = 10;
  
  // Card 1: Total Trades (fara diacritice)
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(20, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Total Tradeuri', 25, yPosition + 7);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(stats.totalTrades.toString(), 25, yPosition + 16);
  
  // Card 2: Profitabile
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(20 + cardWidth + spacing, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('Profitabile', 25 + cardWidth + spacing, yPosition + 7);
  doc.setFontSize(16);
  doc.text(stats.totalWins.toString(), 25 + cardWidth + spacing, yPosition + 16);
  
  yPosition += cardHeight + spacing;
  
  // Card 3: Pe Minus
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(20, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('Pe Minus', 25, yPosition + 7);
  doc.setFontSize(16);
  doc.text(stats.totalLosses.toString(), 25, yPosition + 16);
  
  // Card 4: Win Rate
  const winRateColor = stats.winRate >= 50 ? [34, 197, 94] : [239, 68, 68];
  doc.setFillColor(...winRateColor);
  doc.roundedRect(20 + cardWidth + spacing, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('Rata de Win', 25 + cardWidth + spacing, yPosition + 7);
  doc.setFontSize(16);
  doc.text(`${stats.winRate.toFixed(1)}%`, 25 + cardWidth + spacing, yPosition + 16);
  
  yPosition += cardHeight + 15;
  
  // Tabel final cu totale
  autoTable(doc, {
    startY: yPosition,
    head: [['Indicator', 'Valoare']],
    body: [
      ['Total lunar al pips-urilor din tradeuri profitabile', `+${stats.totalPipsWon.toFixed(1)} pips`],
      ['Total lunar al pips-urilor din tradeuri cu SL', `-${stats.totalPipsLost.toFixed(1)} pips`],
      ['Total profit net in pips (dupa pierderi)', `${stats.netPips > 0 ? '+' : ''}${stats.netPips.toFixed(1)} pips`]
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [59, 130, 246],
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: { 
      fontSize: 10 
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: 'bold' },
      1: { cellWidth: 50, halign: 'right', fontStyle: 'bold', fontSize: 11 }
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        // Rândul 0: Pips profitabile - text verde
        if (data.row.index === 0 && data.column.index === 1) {
          data.cell.styles.textColor = [34, 197, 94];
        }
        // Rândul 1: Pips pierdute - text roșu
        else if (data.row.index === 1 && data.column.index === 1) {
          data.cell.styles.textColor = [239, 68, 68];
        }
        // Rândul 2: Profit net - fundal și text colorat pe ambele coloane
        else if (data.row.index === 2) {
          const bgColor = stats.netPips >= 0 ? [240, 253, 244] : [254, 242, 242];
          const textColor = stats.netPips >= 0 ? [34, 197, 94] : [239, 68, 68];
          
          data.cell.styles.fillColor = bgColor;
          if (data.column.index === 1) {
            data.cell.styles.textColor = textColor;
          }
        }
      }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `ProFX Academy | Pagina ${i} din ${pageCount}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Salvează PDF-ul
  const fileName = `ProFX_Journal_${months[month]}_${year}.pdf`;
  doc.save(fileName);
};
