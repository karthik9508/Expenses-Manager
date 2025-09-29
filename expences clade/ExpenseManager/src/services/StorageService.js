import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = '@expenses';
const NEXT_ID_KEY = '@next_expense_id';
const CUSTOM_CATEGORIES_KEY = '@custom_categories';
const USER_PROFILE_KEY = '@user_profile';

class StorageService {
  async getExpenses() {
    try {
      const expenses = await AsyncStorage.getItem(EXPENSES_KEY);
      return expenses ? JSON.parse(expenses) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  async saveExpenses(expenses) {
    try {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving expenses:', error);
      return false;
    }
  }

  async addExpense(expense) {
    try {
      const expenses = await this.getExpenses();
      const nextId = await this.getNextId();

      const newExpense = {
        id: nextId,
        ...expense,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expenses.push(newExpense);
      await this.saveExpenses(expenses);
      await this.incrementNextId();

      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      return null;
    }
  }

  async updateExpense(id, updatedExpense) {
    try {
      const expenses = await this.getExpenses();
      const index = expenses.findIndex(expense => expense.id === id);

      if (index !== -1) {
        expenses[index] = {
          ...expenses[index],
          ...updatedExpense,
          updatedAt: new Date().toISOString()
        };
        await this.saveExpenses(expenses);
        return expenses[index];
      }

      return null;
    } catch (error) {
      console.error('Error updating expense:', error);
      return null;
    }
  }

  async deleteExpense(id) {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(expense => expense.id !== id);
      await this.saveExpenses(filteredExpenses);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  }

  async getNextId() {
    try {
      const nextId = await AsyncStorage.getItem(NEXT_ID_KEY);
      return nextId ? parseInt(nextId) : 1;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return 1;
    }
  }

  async incrementNextId() {
    try {
      const nextId = await this.getNextId();
      await AsyncStorage.setItem(NEXT_ID_KEY, (nextId + 1).toString());
    } catch (error) {
      console.error('Error incrementing next ID:', error);
    }
  }

  async getExpensesByCategory(category) {
    try {
      const expenses = await this.getExpenses();
      return expenses.filter(expense => expense.category === category);
    } catch (error) {
      console.error('Error getting expenses by category:', error);
      return [];
    }
  }

  async getTotalByCategory() {
    try {
      const expenses = await this.getExpenses();
      const totals = {};

      expenses.forEach(expense => {
        if (totals[expense.category]) {
          totals[expense.category] += parseFloat(expense.amount);
        } else {
          totals[expense.category] = parseFloat(expense.amount);
        }
      });

      return totals;
    } catch (error) {
      console.error('Error getting totals by category:', error);
      return {};
    }
  }

  async getCustomCategories() {
    try {
      const categories = await AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY);
      return categories ? JSON.parse(categories) : {};
    } catch (error) {
      console.error('Error loading custom categories:', error);
      return {};
    }
  }

  async saveCustomCategory(categoryKey, categoryData) {
    try {
      const categories = await this.getCustomCategories();
      categories[categoryKey] = categoryData;
      await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Error saving custom category:', error);
      return false;
    }
  }

  async deleteCustomCategory(categoryKey) {
    try {
      const categories = await this.getCustomCategories();
      delete categories[categoryKey];
      await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Error deleting custom category:', error);
      return false;
    }
  }

  async getAllCategories() {
    try {
      const customCategories = await this.getCustomCategories();
      return { ...customCategories };
    } catch (error) {
      console.error('Error getting all categories:', error);
      return {};
    }
  }

  async getUserProfile() {
    try {
      const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  async saveUserProfile(profileData) {
    try {
      const currentProfile = await this.getUserProfile();
      const updatedProfile = {
        ...currentProfile,
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      if (!currentProfile) {
        updatedProfile.createdAt = new Date().toISOString();
      }

      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return null;
    }
  }

  async deleteUserProfile() {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return false;
    }
  }

  async getUserCurrency() {
    try {
      const profile = await this.getUserProfile();
      return profile?.currency || 'USD';
    } catch (error) {
      console.error('Error getting user currency:', error);
      return 'USD';
    }
  }
}

export default new StorageService();