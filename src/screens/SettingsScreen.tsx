import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  useTheme,
  Text,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../types';
import { StorageService } from '../services/storageService';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface AppSettings {
  notifications: boolean;
  hapticFeedback: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark';
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const theme = useTheme();
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    hapticFeedback: true,
    autoSave: true,
    theme: 'light',
  });

  const storageService = new StorageService();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await storageService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await storageService.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleExportData = async () => {
    try {
      const exportedData = await storageService.exportData();
      
      await Share.share({
        message: exportedData,
        title: 'Smart Diet Scanner Data Export',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your scan history, profile data, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAllData();
              Alert.alert('Success', 'All data has been cleared');
              navigation.navigate('Profile');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Smart Diet Scanner',
      'Version 1.0.0\n\nSmart Diet Scanner helps you make informed food choices by analyzing ingredients and providing personalized health recommendations.\n\nDeveloped with ❤️ for your health and wellbeing.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Preferences */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Preferences</Title>
          
          <List.Item
            title="Notifications"
            description="Receive alerts about flagged ingredients"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                color={theme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title="Haptic Feedback"
            description="Vibration feedback for interactions"
            left={(props) => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                color={theme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title="Auto-save Scans"
            description="Automatically save scan results to history"
            left={(props) => <List.Icon {...props} icon="save" />}
            right={() => (
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => updateSetting('autoSave', value)}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Data Management</Title>
          
          <List.Item
            title="Export Data"
            description="Export your profile and scan history"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleExportData}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Clear All Data"
            description="Permanently delete all app data"
            left={(props) => <List.Icon {...props} icon="delete-forever" color={theme.colors.error} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleClearAllData}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      {/* Privacy & Security */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Privacy & Security</Title>
          
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyText}>
              Your data is stored locally on your device and is never shared with third parties. 
              We respect your privacy and do not collect any personal information.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About</Title>
          
          <List.Item
            title="App Information"
            description="Version, credits, and more"
            left={(props) => <List.Icon {...props} icon="info" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
          />
          
          <List.Item
            title="Rate This App"
            description="Help us improve by leaving a review"
            left={(props) => <List.Icon {...props} icon="star" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Thank You!', 'Rating functionality would be implemented here')}
          />
        </Card.Content>
      </Card>

      {/* Health Disclaimer */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Health Disclaimer</Title>
          <Text style={styles.disclaimerText}>
            This app provides general nutritional information and should not replace professional medical advice. 
            Always consult with healthcare professionals for specific dietary needs and medical conditions.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 15,
    marginBottom: 0,
    marginTop: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 8,
  },
  privacyInfo: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2E7D32',
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});