import { supabase } from '../config/supabase';

const STORAGE_KEY = 'donation_transactions';

export const transactionService = {
  async saveTransaction(transactionData) {
    try {
      const transactions = this.getStoredTransactions();
      const newTransaction = {
        id: Date.now().toString(),
        ...transactionData,
        created_at: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      this.saveToStorage(transactions);
      return newTransaction;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  },

  async updateTransactionStatus(transactionHash, status) {
    try {
      const transactions = this.getStoredTransactions();
      const transaction = transactions.find(
        t => t.transaction_hash === transactionHash
      );
      if (transaction) {
        transaction.status = status;
        this.saveToStorage(transactions);
      }
      return transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async getTransactions(userId) {
    try {
      if (!userId) {
        console.warn('No user ID provided to getTransactions');
        return [];
      }

      // First, get the donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('Donations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (donationsError) {
        console.error('Supabase error fetching donations:', donationsError);
        throw donationsError;
      }

      // If we have donations, fetch the associated charities
      if (donationsData && donationsData.length > 0) {
        const charityIds = [...new Set(donationsData.map(d => d.charity_id))];
        
        const { data: charitiesData, error: charitiesError } = await supabase
          .from('charities')
          .select('id, name')
          .in('id', charityIds);

        if (charitiesError) {
          console.error('Supabase error fetching charities:', charitiesError);
          throw charitiesError;
        }

        // Create a map of charity data for quick lookup
        const charityMap = new Map(charitiesData?.map(c => [c.id, c]) || []);

        // Combine the data
        const transformedData = donationsData.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          eth_amount: donation.eth_amount,
          created_at: donation.created_at,
          charities: charityMap.get(donation.charity_id) || { name: 'Unknown Charity' }
        }));

        return transformedData;
      }

      return [];
    } catch (error) {
      console.error('Error in getTransactions:', error);
      throw error;
    }
  },

  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('Donations')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    return data;
  },

  // Helper methods for localStorage
  getStoredTransactions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveToStorage(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}; 