import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';
import { DefaultExpenseCategories, getCategoryColor, formatCurrency } from '../types';

export default function ExpenseListScreen({ navigation, route }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [allCategories, setAllCategories] = useState({});
  const [userCurrency, setUserCurrency] = useState('USD');

  const loadExpenses = async () => {
    try {
      const expensesData = await StorageService.getExpenses();
      const customCategories = await StorageService.getCustomCategories();
      const currency = await StorageService.getUserCurrency();
      setExpenses(expensesData);
      setAllCategories({ ...DefaultExpenseCategories, ...customCategories });
      setUserCurrency(currency);
      applyFilter(expensesData, selectedCategory);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses');
    }
  };

  const applyFilter = (expensesData, category) => {
    if (category) {
      const filtered = expensesData.filter(expense => expense.category === category);
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expensesData);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  useEffect(() => {
    applyFilter(expenses, selectedCategory);
  }, [selectedCategory, expenses]);

  const handleDeleteExpense = (expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.deleteExpense(expense.id);
            if (success) {
              loadExpenses();
            } else {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseCard}>
      <TouchableOpacity
        style={styles.expenseContent}
        onPress={() => navigation.navigate('EditExpense', { expense: item })}
      >
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            <Text style={styles.expenseDescription}>{item.description}</Text>
          </View>
          <Text style={styles.expenseAmount}>{formatCurrency(item.amount, userCurrency)}</Text>
        </View>

        <View style={styles.expenseFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category, allCategories) }]}>
            <Text style={styles.categoryText}>
              {allCategories[item.category] ?
                (typeof allCategories[item.category] === 'string' ? allCategories[item.category] : allCategories[item.category].name) :
                item.category}
            </Text>
          </View>
          <Text style={styles.expenseDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExpense(item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilterItem = (categoryKey) => {
    const categoryName = allCategories[categoryKey] ?
      (typeof allCategories[categoryKey] === 'string' ? allCategories[categoryKey] : allCategories[categoryKey].name) :
      categoryKey;

    return (
      <TouchableOpacity
        key={categoryKey}
        style={[
          styles.categoryFilterItem,
          selectedCategory === categoryKey && styles.selectedCategoryFilter
        ]}
        onPress={() => {
          setSelectedCategory(categoryKey);
          setShowCategoryFilter(false);
        }}
      >
        <Text style={[
          styles.categoryFilterText,
          selectedCategory === categoryKey && styles.selectedCategoryFilterText
        ]}>
          {categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCategoryFilter(true)}
        >
          <Text style={styles.filterButtonText}>
            {selectedCategory ?
              `Filter: ${allCategories[selectedCategory] ?
                (typeof allCategories[selectedCategory] === 'string' ? allCategories[selectedCategory] : allCategories[selectedCategory].name) :
                selectedCategory}` :
              'All Categories'}
          </Text>
        </TouchableOpacity>

        {selectedCategory && (
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.clearFilterText}>Clear Filter</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedCategory
                ? `No expenses found in ${allCategories[selectedCategory] ?
                    (typeof allCategories[selectedCategory] === 'string' ? allCategories[selectedCategory] : allCategories[selectedCategory].name) :
                    selectedCategory} category`
                : 'No expenses found. Add your first expense!'}
            </Text>
          </View>
        }
      />

      <Modal
        visible={showCategoryFilter}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>

            <ScrollView style={styles.categoryList}>
              <TouchableOpacity
                style={[
                  styles.categoryFilterItem,
                  !selectedCategory && styles.selectedCategoryFilter
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setShowCategoryFilter(false);
                }}
              >
                <Text style={[
                  styles.categoryFilterText,
                  !selectedCategory && styles.selectedCategoryFilterText
                ]}>
                  All Categories
                </Text>
              </TouchableOpacity>

              {Object.keys(allCategories).map(renderCategoryFilterItem)}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryFilter(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  clearFilterButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  clearFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  expenseContent: {
    padding: 15,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 15,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryFilterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategoryFilter: {
    backgroundColor: '#2196F3',
  },
  categoryFilterText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});