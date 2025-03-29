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
      const transactions = this.getStoredTransactions();
      return transactions
        .filter(t => t.donor_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
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