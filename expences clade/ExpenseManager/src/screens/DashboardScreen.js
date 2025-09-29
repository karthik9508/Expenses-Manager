import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';
import { DefaultExpenseCategories, getCategoryColor, formatCurrency } from '../types';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [allCategories, setAllCategories] = useState({});
  const [userCurrency, setUserCurrency] = useState('USD');

  const loadData = async () => {
    try {
      const expensesData = await StorageService.getExpenses();
      const totals = await StorageService.getTotalByCategory();
      const customCategories = await StorageService.getCustomCategories();
      const currency = await StorageService.getUserCurrency();

      setExpenses(expensesData);
      setCategoryTotals(totals);
      setAllCategories({ ...DefaultExpenseCategories, ...customCategories });
      setUserCurrency(currency);

      const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);
      setTotalExpenses(total);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderCategoryCard = (categoryKey) => {
    const categoryName = allCategories[categoryKey] ?
      (typeof allCategories[categoryKey] === 'string' ? allCategories[categoryKey] : allCategories[categoryKey].name) :
      categoryKey;
    const amount = categoryTotals[categoryKey] || 0;
    const customCategories = {};
    Object.keys(allCategories).forEach(key => {
      if (typeof allCategories[key] === 'object') {
        customCategories[key] = allCategories[key];
      }
    });
    const color = getCategoryColor(categoryKey, customCategories);

    return (
      <TouchableOpacity
        key={categoryKey}
        style={[styles.categoryCard, { borderLeftColor: color }]}
        onPress={() => navigation.navigate('ExpenseList', { category: categoryKey })}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          <Text style={styles.categoryAmount}>{formatCurrency(amount, userCurrency)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Total Expenses</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalExpenses, userCurrency)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {Object.keys(allCategories).map(renderCategoryCard)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.actionButtonText}>+ Add New Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('ExpenseList')}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            View All Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.tertiaryButton]}
          onPress={() => navigation.navigate('CategoryManagement')}
        >
          <Text style={[styles.actionButtonText, styles.tertiaryButtonText]}>
            Manage Categories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.slice(0, 3).map((expense) => (
          <TouchableOpacity
            key={expense.id}
            style={styles.recentExpenseCard}
            onPress={() => navigation.navigate('EditExpense', { expense })}
          >
            <View style={styles.recentExpenseContent}>
              <View>
                <Text style={styles.recentExpenseTitle}>{expense.title}</Text>
                <Text style={styles.recentExpenseCategory}>{expense.category}</Text>
              </View>
              <Text style={styles.recentExpenseAmount}>{formatCurrency(expense.amount, userCurrency)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: (width - 45) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  tertiaryButtonText: {
    color: '#28a745',
  },
  recentExpenseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  recentExpenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentExpenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentExpenseCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recentExpenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});