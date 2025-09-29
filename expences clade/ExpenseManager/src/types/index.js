export const DefaultExpenseCategories = {
  FOOD: 'Food',
  TRANSPORT: 'Transport',
  SHOPPING: 'Shopping',
  BILLS: 'Bills',
  ENTERTAINMENT: 'Entertainment',
  HEALTH: 'Health',
  EDUCATION: 'Education',
  OTHER: 'Other'
};

export const DefaultCategoryColors = {
  'Food': '#FF6B6B',
  'Transport': '#4ECDC4',
  'Shopping': '#45B7D1',
  'Bills': '#FFA07A',
  'Entertainment': '#98D8C8',
  'Health': '#F06292',
  'Education': '#AED581',
  'Other': '#FFB74D'
};

export const AvailableColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F06292', '#AED581', '#FFB74D', '#9C27B0', '#3F51B5',
  '#009688', '#FF9800', '#795548', '#607D8B', '#E91E63',
  '#8BC34A', '#FF5722', '#673AB7', '#2196F3', '#4CAF50'
];

export const getCategoryColor = (category, customCategories = {}) => {
  if (customCategories[category]) {
    return customCategories[category].color;
  }
  return DefaultCategoryColors[category] || '#757575';
};

export const getRandomColor = () => {
  return AvailableColors[Math.floor(Math.random() * AvailableColors.length)];
};

export const DefaultUserProfile = {
  name: '',
  email: '',
  contact: '',
  avatar: null,
  currency: DefaultCurrency,
  createdAt: null,
  updatedAt: null
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateContact = (contact) => {
  const contactRegex = /^[\d\s\-\+\(\)]+$/;
  return contactRegex.test(contact) && contact.replace(/\D/g, '').length >= 10;
};

export const SupportedCurrencies = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: '₣', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK' },
  PLN: { symbol: 'zł', name: 'Polish Zloty', code: 'PLN' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna', code: 'CZK' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint', code: 'HUF' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB' },
  PHP: { symbol: '₱', name: 'Philippine Peso', code: 'PHP' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', code: 'IDR' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', code: 'VND' },
  EGP: { symbol: '£', name: 'Egyptian Pound', code: 'EGP' },
  SAR: { symbol: '﷼', name: 'Saudi Riyal', code: 'SAR' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED' },
  ILS: { symbol: '₪', name: 'Israeli Shekel', code: 'ILS' }
};

export const DefaultCurrency = 'USD';

export const formatCurrency = (amount, currencyCode = DefaultCurrency) => {
  const currency = SupportedCurrencies[currencyCode];
  if (!currency) return `$${amount}`;

  // Format number with appropriate decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Handle special positioning for some currencies
  switch (currencyCode) {
    case 'EUR':
    case 'PLN':
    case 'CZK':
    case 'HUF':
      return `${formattedAmount} ${currency.symbol}`;
    default:
      return `${currency.symbol}${formattedAmount}`;
  }
};

export const getCurrencySymbol = (currencyCode = DefaultCurrency) => {
  const currency = SupportedCurrencies[currencyCode];
  return currency ? currency.symbol : '$';
};