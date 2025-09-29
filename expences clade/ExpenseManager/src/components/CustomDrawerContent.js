import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';

export default function CustomDrawerContent(props) {
  const [userProfile, setUserProfile] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const profile = await StorageService.getUserProfile();
      setUserProfile(profile);
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
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigateToScreen('Profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {getInitials(userProfile?.name)}
            </Text>
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
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.navigationSection}>
          <DrawerItem
            label="Dashboard"
            onPress={() => navigateToScreen('Dashboard')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Text style={[styles.drawerIcon, { color }]}>🏠</Text>
            )}
          />

          <DrawerItem
            label="All Expenses"
            onPress={() => navigateToScreen('ExpenseList')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Text style={[styles.drawerIcon, { color }]}>📝</Text>
            )}
          />

          <DrawerItem
            label="Add Expense"
            onPress={() => navigateToScreen('AddExpense')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Text style={[styles.drawerIcon, { color }]}>➕</Text>
            )}
          />

          <DrawerItem
            label="Manage Categories"
            onPress={() => navigateToScreen('CategoryManagement')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Text style={[styles.drawerIcon, { color }]}>📂</Text>
            )}
          />

          <View style={styles.divider} />

          <DrawerItem
            label="My Profile"
            onPress={() => navigateToScreen('Profile')}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Text style={[styles.drawerIcon, { color }]}>👤</Text>
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
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
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
  },
  profileSubtext: {
    fontSize: 14,
    color: '#E3F2FD',
    fontStyle: 'italic',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigationSection: {
    flex: 1,
    paddingTop: 10,
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
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});