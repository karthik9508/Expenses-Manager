import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StorageService from '../services/StorageService';
import { DefaultExpenseCategories, getCategoryColor, getCurrencySymbol } from '../types';

export default function EditExpenseScreen({ navigation, route }) {
  const { expense } = route.params;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState({});
  const [userCurrency, setUserCurrency] = useState('USD');

  useEffect(() => {
    loadCategories();
    if (expense) {
      setTitle(expense.title || '');
      setAmount(expense.amount ? expense.amount.toString() : '');
      setDescription(expense.description || '');
      setSelectedCategory(expense.category || '');
    }
  }, [expense]);

  const loadCategories = async () => {
    try {
      const customCategories = await StorageService.getCustomCategories();
      setAllCategories({ ...DefaultExpenseCategories, ...customCategories });
    } catch (error) {
      console.error('Error loading categories:', error);
      setAllCategories(DefaultExpenseCategories);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedExpense = {
        title: title.trim(),
        amount: parseFloat(amount).toFixed(2),
        description: description.trim(),
        category: selectedCategory,
      };

      const savedExpense = await StorageService.updateExpense(expense.id, updatedExpense);
      if (savedExpense) {
        Alert.alert('Success', 'Expense updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to update expense');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
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
              Alert.alert('Success', 'Expense deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const renderCategoryButton = (categoryKey) => {
    const categoryName = allCategories[categoryKey] ?
      (typeof allCategories[categoryKey] === 'string' ? allCategories[categoryKey] : allCategories[categoryKey].name) :
      categoryKey;
    const isSelected = selectedCategory === categoryKey;
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
        style={[
          styles.categoryButton,
          isSelected && { backgroundColor: color, borderColor: color }
        ]}
        onPress={() => setSelectedCategory(categoryKey)}
      >
        <Text style={[
          styles.categoryButtonText,
          isSelected && styles.selectedCategoryText
        ]}>
          {categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseInfoText}>
              Created: {formatDate(expense.createdAt)}
            </Text>
            {expense.updatedAt !== expense.createdAt && (
              <Text style={styles.expenseInfoText}>
                Updated: {formatDate(expense.updatedAt)}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter expense title"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {Object.keys(allCategories).map(renderCategoryButton)}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isLoading}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
  },
  expenseInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  expenseInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});