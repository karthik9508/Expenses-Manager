import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SupportedCurrencies } from '../types';

// Popular currencies that will be shown prominently
const PopularCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF'];

export default function SimpleCurrencySelector({
  selectedCurrency,
  onCurrencySelect,
  style
}) {
  const [expanded, setExpanded] = useState(false);

  const handleCurrencySelect = (currencyCode) => {
    onCurrencySelect(currencyCode);
    setExpanded(false);
  };

  const selectedCurrencyDetails = SupportedCurrencies[selectedCurrency] || SupportedCurrencies.USD;

  const renderCurrencyButton = (currencyCode) => {
    const currency = SupportedCurrencies[currencyCode];
    const isSelected = currencyCode === selectedCurrency;

    return (
      <TouchableOpacity
        key={currencyCode}
        style={[
          styles.currencyOption,
          isSelected && styles.selectedCurrencyOption
        ]}
        onPress={() => handleCurrencySelect(currencyCode)}
      >
        <Text style={styles.currencySymbol}>{currency.symbol}</Text>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{currency.code}</Text>
          <Text style={styles.currencyName} numberOfLines={1}>{currency.name}</Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.selectedCurrency}>
          <Text style={styles.selectedSymbol}>{selectedCurrencyDetails.symbol}</Text>
          <Text style={styles.selectedCode}>{selectedCurrencyDetails.code}</Text>
          <Text style={styles.selectedName}>{selectedCurrencyDetails.name}</Text>
        </View>
        <Text style={[styles.arrow, expanded && styles.arrowUp]}>▼</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dropdown}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <View style={styles.currencyGrid}>
            {PopularCurrencies.map(renderCurrencyButton)}
          </View>

          <Text style={styles.sectionTitle}>All Currencies</Text>
          <ScrollView style={styles.allCurrenciesScroll} showsVerticalScrollIndicator={false}>
            {Object.keys(SupportedCurrencies)
              .filter(code => !PopularCurrencies.includes(code))
              .map(renderCurrencyButton)}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  selector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 8,
    width: 25,
  },
  selectedCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  selectedName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    transform: [{ rotate: '0deg' }],
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  currencyGrid: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  allCurrenciesScroll: {
    maxHeight: 150,
    paddingHorizontal: 10,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  selectedCurrencyOption: {
    backgroundColor: '#e3f2fd',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 25,
    textAlign: 'center',
    marginRight: 10,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  currencyName: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});