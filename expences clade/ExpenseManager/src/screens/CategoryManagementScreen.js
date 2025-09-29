import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import StorageService from '../services/StorageService';
import { DefaultExpenseCategories, DefaultCategoryColors, AvailableColors, getRandomColor } from '../types';

export default function CategoryManagementScreen({ navigation }) {
  const [categories, setCategories] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#757575');

  useEffect(() => {
    loadCategories();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openAddModal()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadCategories = async () => {
    try {
      const customCategories = await StorageService.getCustomCategories();
      setCategories(customCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setSelectedColor(getRandomColor());
    setShowAddModal(true);
  };

  const openEditModal = (categoryKey, categoryData) => {
    setEditingCategory(categoryKey);
    setNewCategoryName(categoryData.name);
    setSelectedColor(categoryData.color);
    setShowAddModal(true);
  };

  const saveCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    try {
      const categoryKey = editingCategory || newCategoryName.toUpperCase().replace(/\s+/g, '_');
      await StorageService.saveCustomCategory(categoryKey, {
        name: newCategoryName.trim(),
        color: selectedColor
      });

      setShowAddModal(false);
      loadCategories();
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
      console.error('Error saving category:', error);
    }
  };

  const deleteCategory = async (categoryKey) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteCustomCategory(categoryKey);
              loadCategories();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
              console.error('Error deleting category:', error);
            }
          }
        }
      ]
    );
  };

  const renderDefaultCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.defaultLabel}>Default</Text>
      </View>
    </View>
  );

  const renderCustomCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item.key, item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCategory(item.key)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const defaultCategoriesData = Object.keys(DefaultExpenseCategories).map(key => ({
    key,
    name: DefaultExpenseCategories[key],
    color: DefaultCategoryColors[key]
  }));

  const customCategoriesData = Object.keys(categories).map(key => ({
    key,
    name: categories[key].name,
    color: categories[key].color
  }));

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Default Categories</Text>
        <FlatList
          data={defaultCategoriesData}
          renderItem={renderDefaultCategory}
          keyExtractor={item => item.key}
          scrollEnabled={false}
        />

        <Text style={styles.sectionTitle}>Custom Categories</Text>
        {customCategoriesData.length > 0 ? (
          <FlatList
            data={customCategoriesData}
            renderItem={renderCustomCategory}
            keyExtractor={item => item.key}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No custom categories yet. Tap + to add one.</Text>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Text>

            <Text style={styles.inputLabel}>Category Name</Text>
            <TextInput
              style={styles.textInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Enter category name"
              maxLength={20}
            />

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {AvailableColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveCategory}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333'
  },
  categoryItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  defaultLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  categoryActions: {
    flexDirection: 'row'
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4
  },
  cancelButton: {
    backgroundColor: '#6c757d'
  },
  saveButton: {
    backgroundColor: '#007bff'
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});