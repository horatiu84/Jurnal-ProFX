/* eslint-disable no-unused-vars */
// src/hooks/useTrades.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'trades'),
      (snapshot) => {
        const tradesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sortează local după dată
        tradesData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTrades(tradesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching trades:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTrade = async (tradeData) => {
    try {
      await addDoc(collection(db, 'trades'), {
        ...tradeData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding trade:', err);
      throw err;
    }
  };

  const updateTrade = async (tradeId, tradeData) => {
    try {
      await updateDoc(doc(db, 'trades', tradeId), tradeData);
    } catch (err) {
      console.error('Error updating trade:', err);
      throw err;
    }
  };

  const deleteTrade = async (tradeId) => {
    try {
      await deleteDoc(doc(db, 'trades', tradeId));
    } catch (err) {
      console.error('Error deleting trade:', err);
      throw err;
    }
  };

  return { trades, loading, error, addTrade, updateTrade, deleteTrade };
};