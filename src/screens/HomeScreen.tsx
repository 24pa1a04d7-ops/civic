import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  useTheme,
  Avatar,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { RootStackParamList, User, ScanSession } from '../types';
import { StorageService } from '../services/storageService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [recentScans, setRecentScans] = useState<ScanSession[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    safeProducts: 0,
    flaggedProducts: 0,
  });

  const storageService = new StorageService();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storageService.getUserProfile();
      const scanHistory = await storageService.getScanHistory();
      
      setUser(userData);
      setRecentScans(scanHistory.slice(0, 3)); // Show last 3 scans
      
      // Calculate stats
      const totalScans = scanHistory.length;
      const safeProducts = scanHistory.filter(scan => 
        scan.analysis.overallSafety === 'safe'
      ).length;
      const flaggedProducts = totalScans - safeProducts;
      
      setStats({ totalScans, safeProducts, flaggedProducts });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleScanPress = () => {
    navigation.navigate('Scanner');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleSetupProfile = () => {
    navigation.navigate('Profile');
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar.Icon 
              size={60} 
              icon="account" 
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
            <View style={styles.headerText}>
              <Title style={styles.welcomeText}>
                Welcome{user ? `, ${user.name}` : ''}!
              </Title>
              <Paragraph style={styles.subtitleText}>
                Scan food labels for personalized health insights
              </Paragraph>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={handleScanPress}
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.actionButtonContent}
                labelStyle={styles.actionButtonLabel}
              >
                <Icon name="camera-alt" size={24} color="white" />
                {'\n'}Scan Product
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleViewHistory}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                labelStyle={[styles.actionButtonLabel, { color: theme.colors.primary }]}
              >
                <Icon name="history" size={24} color={theme.colors.primary} />
                {'\n'}View History
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Your Health Journey</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalScans}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                  {stats.safeProducts}
                </Text>
                <Text style={styles.statLabel}>Safe Products</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.error }]}>
                  {stats.flaggedProducts}
                </Text>
                <Text style={styles.statLabel}>Flagged Items</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Setup Reminder */}
        {!user && (
          <Card style={styles.reminderCard}>
            <Card.Content>
              <View style={styles.reminderContent}>
                <Icon name="info" size={24} color={theme.colors.primary} />
                <View style={styles.reminderText}>
                  <Title style={styles.reminderTitle}>Complete Your Profile</Title>
                  <Paragraph>
                    Add your health conditions and dietary preferences for personalized analysis
                  </Paragraph>
                </View>
              </View>
              <Button 
                mode="contained" 
                onPress={handleSetupProfile}
                style={styles.reminderButton}
              >
                Set Up Profile
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <Card style={styles.recentScansCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>Recent Scans</Title>
                <Button onPress={handleViewHistory}>View All</Button>
              </View>
              
              {recentScans.map((scan) => (
                <Surface key={scan.id} style={styles.scanItem}>
                  <View style={styles.scanContent}>
                    <View style={styles.scanInfo}>
                      <Text style={styles.productName}>{scan.product.name}</Text>
                      <Text style={styles.scanDate}>
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    <Chip
                      icon={() => (
                        <Icon 
                          name={getSafetyIcon(scan.analysis.overallSafety)} 
                          size={16} 
                          color="white"
                        />
                      )}
                      style={[
                        styles.safetyChip,
                        { backgroundColor: getSafetyColor(scan.analysis.overallSafety) }
                      ]}
                      textStyle={{ color: 'white' }}
                    >
                      {scan.analysis.overallSafety.toUpperCase()}
                    </Chip>
                  </View>
                </Surface>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Health Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Today's Health Tip</Title>
            <View style={styles.tipContent}>
              <Icon name="lightbulb" size={24} color={theme.colors.primary} />
              <Paragraph style={styles.tipText}>
                Always check the first few ingredients on food labels - they make up the largest portion of the product.
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  quickActionsCard: {
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 12,
  },
  actionButtonContent: {
    height: 80,
    justifyContent: 'center',
  },
  actionButtonLabel: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsCard: {
    marginBottom: 20,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reminderCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#E8F5E8',
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reminderText: {
    marginLeft: 15,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  reminderButton: {
    alignSelf: 'flex-start',
  },
  recentScansCard: {
    marginBottom: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  scanContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  scanDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  safetyChip: {
    marginLeft: 10,
  },
  tipsCard: {
    marginBottom: 20,
    elevation: 4,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
  },
});