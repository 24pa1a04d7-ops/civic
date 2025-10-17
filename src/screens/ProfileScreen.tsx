import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  TextInput,
  List,
  Switch,
  useTheme,
  Text,
  Avatar,
  Surface,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, User, HealthCondition, Allergy, DietaryPreference } from '../types';
import { StorageService } from '../services/storageService';
import { HEALTH_CONDITIONS } from '../constants/healthConditions';
import { COMMON_ALLERGIES } from '../constants/allergies';
import { DIETARY_PREFERENCES } from '../constants/dietaryPreferences';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const storageService = new StorageService();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await storageService.getUserProfile();
      if (userData) {
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email || '');
      } else {
        setIsEditing(true); // New user, start in editing mode
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsSaving(true);
      
      const userData: User = {
        id: user?.id || Date.now().toString(),
        name: name.trim(),
        email: email.trim() || undefined,
        healthConditions: user?.healthConditions || [],
        allergies: user?.allergies || [],
        dietaryPreferences: user?.dietaryPreferences || [],
        createdAt: user?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await storageService.saveUserProfile(userData);
      setUser(userData);
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setIsEditing(false);
    }
  };

  const navigateToHealthConditions = () => {
    navigation.navigate('HealthConditions');
  };

  const navigateToAllergies = () => {
    navigation.navigate('Allergies');
  };

  const navigateToDietaryPreferences = () => {
    navigation.navigate('DietaryPreferences');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const getHealthConditionName = (id: string) => {
    const condition = HEALTH_CONDITIONS.find(hc => hc.id === id);
    return condition?.name || id;
  };

  const getAllergyName = (id: string) => {
    const allergy = COMMON_ALLERGIES.find(a => a.id === id);
    return allergy?.name || id;
  };

  const getDietaryPreferenceName = (id: string) => {
    const preference = DIETARY_PREFERENCES.find(dp => dp.id === id);
    return preference?.name || id;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Surface style={styles.headerSurface}>
        <View style={styles.header}>
          <Avatar.Icon 
            size={80} 
            icon="account" 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.headerInfo}>
            {isEditing ? (
              <View style={styles.editForm}>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Email (optional)"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                />
                <View style={styles.editButtons}>
                  <Button 
                    mode="outlined" 
                    onPress={handleCancelEdit}
                    style={styles.editButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handleSaveProfile}
                    loading={isSaving}
                    style={styles.editButton}
                  >
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.profileInfo}>
                <Title style={styles.userName}>{user?.name || 'User'}</Title>
                {user?.email && (
                  <Text style={styles.userEmail}>{user.email}</Text>
                )}
                <Button 
                  mode="outlined" 
                  onPress={handleEditProfile}
                  style={styles.editProfileButton}
                >
                  Edit Profile
                </Button>
              </View>
            )}
          </View>
        </View>
      </Surface>

      <View style={styles.content}>
        {/* Health Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Health Information</Title>
            
            <List.Item
              title="Health Conditions"
              description={`${user?.healthConditions.length || 0} conditions`}
              left={(props) => <List.Icon {...props} icon="medical-bag" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={navigateToHealthConditions}
              style={styles.listItem}
            />
            
            {user?.healthConditions && user.healthConditions.length > 0 && (
              <View style={styles.chipContainer}>
                {user.healthConditions.slice(0, 3).map((condition) => (
                  <Chip key={condition.id} style={styles.chip} mode="outlined">
                    {getHealthConditionName(condition.id)}
                  </Chip>
                ))}
                {user.healthConditions.length > 3 && (
                  <Chip style={styles.chip} mode="outlined">
                    +{user.healthConditions.length - 3} more
                  </Chip>
                )}
              </View>
            )}

            <List.Item
              title="Allergies"
              description={`${user?.allergies.length || 0} allergies`}
              left={(props) => <List.Icon {...props} icon="alert-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={navigateToAllergies}
              style={styles.listItem}
            />
            
            {user?.allergies && user.allergies.length > 0 && (
              <View style={styles.chipContainer}>
                {user.allergies.slice(0, 3).map((allergy) => (
                  <Chip key={allergy.id} style={styles.chip} mode="outlined">
                    {getAllergyName(allergy.id)}
                  </Chip>
                ))}
                {user.allergies.length > 3 && (
                  <Chip style={styles.chip} mode="outlined">
                    +{user.allergies.length - 3} more
                  </Chip>
                )}
              </View>
            )}

            <List.Item
              title="Dietary Preferences"
              description={`${user?.dietaryPreferences.length || 0} preferences`}
              left={(props) => <List.Icon {...props} icon="food" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={navigateToDietaryPreferences}
              style={styles.listItem}
            />
            
            {user?.dietaryPreferences && user.dietaryPreferences.length > 0 && (
              <View style={styles.chipContainer}>
                {user.dietaryPreferences.slice(0, 3).map((preference) => (
                  <Chip key={preference.id} style={styles.chip} mode="outlined">
                    {getDietaryPreferenceName(preference.id)}
                  </Chip>
                ))}
                {user.dietaryPreferences.length > 3 && (
                  <Chip style={styles.chip} mode="outlined">
                    +{user.dietaryPreferences.length - 3} more
                  </Chip>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>App Settings</Title>
            
            <List.Item
              title="Settings"
              description="Notifications, privacy, and more"
              left={(props) => <List.Icon {...props} icon="settings" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={navigateToSettings}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Profile Completion */}
        {user && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Profile Completion</Title>
              <View style={styles.completionInfo}>
                <Text style={styles.completionText}>
                  Complete your profile for more accurate analysis
                </Text>
                <View style={styles.completionStats}>
                  <View style={styles.completionItem}>
                    <Icon 
                      name={user.healthConditions.length > 0 ? "check-circle" : "radio-button-unchecked"} 
                      size={20} 
                      color={user.healthConditions.length > 0 ? theme.colors.success : '#ccc'} 
                    />
                    <Text style={styles.completionLabel}>Health Conditions</Text>
                  </View>
                  <View style={styles.completionItem}>
                    <Icon 
                      name={user.allergies.length > 0 ? "check-circle" : "radio-button-unchecked"} 
                      size={20} 
                      color={user.allergies.length > 0 ? theme.colors.success : '#ccc'} 
                    />
                    <Text style={styles.completionLabel}>Allergies</Text>
                  </View>
                  <View style={styles.completionItem}>
                    <Icon 
                      name={user.dietaryPreferences.length > 0 ? "check-circle" : "radio-button-unchecked"} 
                      size={20} 
                      color={user.dietaryPreferences.length > 0 ? theme.colors.success : '#ccc'} 
                    />
                    <Text style={styles.completionLabel}>Dietary Preferences</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSurface: {
    elevation: 4,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 20,
    flex: 1,
  },
  editForm: {
    flex: 1,
  },
  input: {
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    marginLeft: 10,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  completionInfo: {
    marginTop: 10,
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  completionStats: {
    flexDirection: 'column',
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  completionLabel: {
    marginLeft: 10,
    fontSize: 14,
  },
});