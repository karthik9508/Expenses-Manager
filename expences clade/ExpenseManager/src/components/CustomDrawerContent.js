import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';
import { SupportedCurrencies, formatCurrency } from '../types';

export default function CustomDrawerContent(props) {
  const [userProfile, setUserProfile] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [userCurrency, setUserCurrency] = useState('USD');
  const fadeAnim = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const profile = await StorageService.getUserProfile();
      const expenses = await StorageService.getExpenses();
      const totals = await StorageService.getTotalByCategory();
      const currency = await StorageService.getUserCurrency();

      setUserProfile(profile);
      setExpenseCount(expenses.length);
      setUserCurrency(currency);

      const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);
      setTotalExpenses(total);

      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const navigateToScreen = (screenName) => {
    props.navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Profile Header with Gradient */}
      <View style={styles.profileHeader}>
        <View style={styles.gradientOverlay} />
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigateToScreen('Profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {getInitials(userProfile?.name)}
            </Text>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userProfile?.name || 'Guest User'}
            </Text>
            {userProfile?.email ? (
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
            ) : (
              <Text style={styles.profileSubtext}>Tap to set up profile</Text>
            )}
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>
                {SupportedCurrencies[userCurrency]?.symbol} {userCurrency}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats Section */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatCurrency(totalExpenses, userCurrency)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expenseCount}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
        </Animated.View>
      </View>

      {/* Enhanced Navigation Items */}
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.navigationSection}>
          {/* Main Section */}
          <Text style={styles.sectionTitle}>OVERVIEW</Text>
          <DrawerItem
            label="Dashboard"
            onPress={() => navigateToScreen('Dashboard')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.modernIcon, { color }]}>⚡</Text>
              </View>
            )}
          />

          {/* Expenses Section */}
          <Text style={styles.sectionTitle}>EXPENSES</Text>
          <DrawerItem
            label="All Expenses"
            onPress={() => navigateToScreen('ExpenseList')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.modernIcon, { color }]}>📊</Text>
              </View>
            )}
          />

          <DrawerItem
            label="Add Expense"
            onPress={() => navigateToScreen('AddExpense')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.modernIcon, { color }]}>💳</Text>
              </View>
            )}
          />

          <DrawerItem
            label="Categories"
            onPress={() => navigateToScreen('CategoryManagement')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.modernIcon, { color }]}>🏷️</Text>
              </View>
            )}
          />

          {/* Account Section */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <DrawerItem
            label="My Profile"
            onPress={() => navigateToScreen('Profile')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.modernIcon, { color }]}>👤</Text>
              </View>
            )}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Expense Manager v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#E3F2FD',
    marginBottom: 6,
  },
  profileSubtext: {
    fontSize: 14,
    color: '#E3F2FD',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  currencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  currencyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigationSection: {
    flex: 1,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 8,
    letterSpacing: 1,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#f8f9fa',
    marginVertical: 10,
  },
  drawerItem: {
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: -20,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
  drawerIcon: {
    fontSize: 20,
    textAlign: 'center',
    width: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});