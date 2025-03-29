import { supabase } from '../config/supabase';
import users from '../data/users.json';

export const authService = {
  login: async (identifier, password) => {
    try {
      // Use local authentication from users.json
      const user = users.users.find(
        u => (u.email === identifier || u.username === identifier) && u.password === password
      );
      
      if (user) {
        // Remove password from user object before returning
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { user: userWithoutPassword, error: null };
      } else {
        return { user: null, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('user');
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  register: async (userData) => {
    try {
      const existingUser = users.users.find(
        u => u.email === userData.email || u.username === userData.username
      );

      if (existingUser) {
        return { 
          user: null, 
          error: 'User with this email or username already exists' 
        };
      }

      const newUser = {
        id: String(users.users.length + 1),
        ...userData
      };

      users.users.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }
}; 