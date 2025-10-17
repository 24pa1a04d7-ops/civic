import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
  Chip,
  Surface,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, Alternative } from '../types';

type AlternativesScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type AlternativesScreenRouteProp = {
  params: {
    alternatives: Alternative[];
  };
};

export default function AlternativesScreen() {
  const navigation = useNavigation<AlternativesScreenNavigationProp>();
  const route = useRoute<AlternativesScreenRouteProp>();
  const theme = useTheme();
  const { alternatives } = route.params;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#8BC34A';
    if (score >= 40) return '#FF9800';
    return '#FF5722';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const handleScanAnother = () => {
    navigation.navigate('Scanner');
  };

  const renderAlternativeItem = ({ item, index }: { item: Alternative; index: number }) => (
    <Card style={styles.alternativeCard}>
      <Card.Content>
        <View style={styles.alternativeHeader}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
          <View style={styles.alternativeInfo}>
            <Title style={styles.alternativeName}>{item.name}</Title>
            <Text style={styles.brandName}>{item.brand}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.healthScore) }]}>
              {item.healthScore}
            </Text>
            <Text style={styles.scoreLabel}>
              {getScoreLabel(item.healthScore)}
            </Text>
          </View>
        </View>

        <View style={styles.reasonContainer}>
          <Icon name="info" size={16} color={theme.colors.primary} />
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>

        {item.availability && (
          <View style={styles.availabilityContainer}>
            <Icon name="store" size={16} color="#666" />
            <Text style={styles.availabilityText}>{item.availability}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => {/* In a real app, this would open a store locator or online store */}}
            style={styles.actionButton}
          >
            Find Stores
          </Button>
          <Button
            mode="text"
            onPress={() => {/* In a real app, this would show more details */}}
            style={styles.actionButton}
          >
            More Info
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={80} color="#ccc" />
      <Title style={styles.emptyTitle}>No Alternatives Found</Title>
      <Text style={styles.emptyText}>
        We couldn't find healthier alternatives for this product at the moment.
        Try scanning other products or check back later.
      </Text>
      <Button mode="contained" onPress={handleScanAnother} style={styles.emptyButton}>
        Scan Another Product
      </Button>
    </View>
  );

  const renderHeader = () => (
    <Surface style={styles.headerContainer}>
      <Title style={styles.headerTitle}>Healthier Alternatives</Title>
      <Text style={styles.headerSubtitle}>
        We found {alternatives.length} better option{alternatives.length !== 1 ? 's' : ''} for you
      </Text>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {alternatives.length > 0 ? (
        <FlatList
          data={alternatives.sort((a, b) => b.healthScore - a.healthScore)}
          renderItem={renderAlternativeItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
      
      {alternatives.length > 0 && (
        <Surface style={styles.bottomContainer}>
          <Button
            mode="contained"
            onPress={handleScanAnother}
            style={styles.scanButton}
            contentStyle={styles.scanButtonContent}
          >
            Scan Another Product
          </Button>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    padding: 20,
    elevation: 4,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  alternativeCard: {
    marginBottom: 15,
    elevation: 4,
  },
  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#E8F5E8',
    padding: 10,
    borderRadius: 8,
  },
  reasonText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  availabilityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    elevation: 8,
  },
  scanButton: {
    borderRadius: 25,
  },
  scanButtonContent: {
    height: 50,
  },
});