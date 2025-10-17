import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  useTheme,
  Chip,
  Surface,
  Button,
  Searchbar,
  FAB,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, ScanSession } from '../types';
import { StorageService } from '../services/storageService';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const theme = useTheme();
  const [scanHistory, setScanHistory] = useState<ScanSession[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'safe' | 'caution' | 'warning' | 'danger'>('all');

  const storageService = new StorageService();

  useFocusEffect(
    useCallback(() => {
      loadScanHistory();
    }, [])
  );

  const loadScanHistory = async () => {
    try {
      const history = await storageService.getScanHistory();
      setScanHistory(history);
      applyFilters(history, searchQuery, selectedFilter);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const applyFilters = (
    history: ScanSession[], 
    query: string, 
    filter: 'all' | 'safe' | 'caution' | 'warning' | 'danger'
  ) => {
    let filtered = history;

    // Apply safety filter
    if (filter !== 'all') {
      filtered = filtered.filter(session => session.analysis.overallSafety === filter);
    }

    // Apply search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(session =>
        session.product.name.toLowerCase().includes(lowerQuery) ||
        session.product.brand?.toLowerCase().includes(lowerQuery) ||
        session.product.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes(lowerQuery)
        )
      );
    }

    setFilteredHistory(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(scanHistory, query, selectedFilter);
  };

  const handleFilterChange = (filter: 'all' | 'safe' | 'caution' | 'warning' | 'danger') => {
    setSelectedFilter(filter);
    setFilterMenuVisible(false);
    applyFilters(scanHistory, searchQuery, filter);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadScanHistory();
    setRefreshing(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteScanSession(sessionId);
              await loadScanHistory();
            } catch (error) {
              console.error('Error deleting scan session:', error);
              Alert.alert('Error', 'Failed to delete scan session');
            }
          }
        }
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all scan history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearScanHistory();
              await loadScanHistory();
            } catch (error) {
              console.error('Error clearing scan history:', error);
              Alert.alert('Error', 'Failed to clear scan history');
            }
          }
        }
      ]
    );
  };

  const handleViewResults = (analysisResult: any) => {
    navigation.navigate('Results', { analysisResult });
  };

  const handleScanNew = () => {
    navigation.navigate('Scanner');
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return theme.colors.success || '#4CAF50';
      case 'caution': return '#FF9800';
      case 'warning': return '#FF5722';
      case 'danger': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case 'safe': return 'check-circle';
      case 'caution': return 'warning';
      case 'warning': return 'error';
      case 'danger': return 'dangerous';
      default: return 'help';
    }
  };

  const renderScanItem = ({ item }: { item: ScanSession }) => (
    <Card style={styles.scanCard} onPress={() => handleViewResults(item.analysis)}>
      <Card.Content>
        <View style={styles.scanHeader}>
          <View style={styles.scanInfo}>
            <Title style={styles.productName}>{item.product.name}</Title>
            {item.product.brand && (
              <Text style={styles.brandName}>{item.product.brand}</Text>
            )}
            <Text style={styles.scanDate}>
              {new Date(item.timestamp).toLocaleDateString()} at{' '}
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Chip
            icon={() => (
              <Icon 
                name={getSafetyIcon(item.analysis.overallSafety)} 
                size={16} 
                color="white"
              />
            )}
            style={[
              styles.safetyChip,
              { backgroundColor: getSafetyColor(item.analysis.overallSafety) }
            ]}
            textStyle={{ color: 'white' }}
          >
            {item.analysis.overallSafety.toUpperCase()}
          </Chip>
        </View>

        <View style={styles.scanDetails}>
          <Text style={styles.detailText}>
            Score: {item.analysis.nutritionalAnalysis.score}/100
          </Text>
          {item.analysis.flaggedIngredients.length > 0 && (
            <Text style={styles.detailText}>
              {item.analysis.flaggedIngredients.length} flagged ingredient(s)
            </Text>
          )}
        </View>

        <View style={styles.scanActions}>
          <Button
            mode="text"
            onPress={() => handleViewResults(item.analysis)}
            style={styles.actionButton}
          >
            View Details
          </Button>
          <Button
            mode="text"
            onPress={() => handleDeleteSession(item.id)}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" size={80} color="#ccc" />
      <Title style={styles.emptyTitle}>No Scan History</Title>
      <Text style={styles.emptyText}>
        Start scanning food products to see your history here
      </Text>
      <Button mode="contained" onPress={handleScanNew} style={styles.emptyButton}>
        Scan Your First Product
      </Button>
    </View>
  );

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'safe': return 'Safe Products';
      case 'caution': return 'Caution Products';
      case 'warning': return 'Warning Products';
      case 'danger': return 'Dangerous Products';
      default: return 'All Products';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setFilterMenuVisible(true)}
              style={styles.filterButton}
            >
              {getFilterLabel()}
            </Button>
          }
        >
          <Menu.Item onPress={() => handleFilterChange('all')} title="All Products" />
          <Menu.Item onPress={() => handleFilterChange('safe')} title="Safe Products" />
          <Menu.Item onPress={() => handleFilterChange('caution')} title="Caution Products" />
          <Menu.Item onPress={() => handleFilterChange('warning')} title="Warning Products" />
          <Menu.Item onPress={() => handleFilterChange('danger')} title="Dangerous Products" />
        </Menu>
      </Surface>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          renderItem={renderScanItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Clear History FAB */}
      {scanHistory.length > 0 && (
        <FAB
          icon="delete-sweep"
          style={styles.clearFab}
          onPress={handleClearHistory}
          label="Clear All"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 15,
    elevation: 4,
  },
  searchbar: {
    marginBottom: 10,
  },
  filterButton: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  scanCard: {
    marginBottom: 15,
    elevation: 4,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  scanInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  scanDate: {
    fontSize: 12,
    color: '#888',
  },
  safetyChip: {
    alignSelf: 'flex-start',
  },
  scanDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  scanActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyButton: {
    paddingHorizontal: 20,
  },
  clearFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});