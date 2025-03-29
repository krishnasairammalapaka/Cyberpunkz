const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const transactionService = {
  // Get all transactions for a user
  async getUserTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        charities (
          name,
          wallet_address
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a new transaction
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select(`
        *,
        charities (
          name,
          wallet_address
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }
};

module.exports = transactionService; 