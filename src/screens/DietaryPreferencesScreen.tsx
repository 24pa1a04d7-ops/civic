import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Checkbox,
  Button,
  useTheme,
  Searchbar,
  Surface,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList, User, DietaryPreference } from '../types';
import { StorageService } from '../services/storageService';
import { DIETARY_PREFERENCES } from '../constants/dietaryPreferences';

type DietaryPreferencesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function DietaryPreferencesScreen() {
  const navigation = useNavigation<DietaryPreferencesScreenNavigationProp>();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPreferences, setFilteredPreferences] = useState(DIETARY_PREFERENCES);
  const [isSaving, setIsSaving] = useState(false);

  const storageService = new StorageService();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    filterPreferences();
  }, [searchQuery]);

  const loadUserProfile = async () => {
    try {
      const userData = await storageService.getUserProfile();
      if (userData) {
        setUser(userData);
        setSelectedPreferences(userData.dietaryPreferences.map(dp => dp.id));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const filterPreferences = () => {
    if (searchQuery.trim()) {
      const filtered = DIETARY_PREFERENCES.filter(preference =>
        preference.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preference.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPreferences(filtered);
    } else {
      setFilteredPreferences(DIETARY_PREFERENCES);
    }
  };

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        return prev.filter(id => id !== preferenceId);
      } else {
        return [...prev, preferenceId];
      }
    });
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User profile not found');
      return;
    }

    try {
      setIsSaving(true);

      const selectedUserPreferences = DIETARY_PREFERENCES
        .filter(preference => selectedPreferences.includes(preference.id))
        .map(preference => ({ id: preference.id }));

      const updatedUser = {
        ...user,
        dietaryPreferences: selectedUserPreferences,
        updatedAt: new Date(),
      };

      await storageService.saveUserProfile(updatedUser);
      setUser(updatedUser);
      
      Alert.alert('Success', 'Dietary preferences updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving dietary preferences:', error);
      Alert.alert('Error', 'Failed to save dietary preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreferenceItem = ({ item }: { item: DietaryPreference }) => {
    const isSelected = selectedPreferences.includes(item.id);
    
    return (
      <Card style={[styles.preferenceCard, isSelected && styles.selectedCard]}>
        <Card.Content>
          <View style={styles.preferenceHeader}>
            <View style={styles.preferenceInfo}>
              <Title style={styles.preferenceName}>{item.name}</Title>
            </View>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => handlePreferenceToggle(item.id)}
              color={theme.colors.primary}
            />
          </View>
          
          <Text style={styles.preferenceDescription}>{item.description}</Text>
          
          {item.restrictedIngredients.length > 0 && (
            <View style={styles.restrictedSection}>
              <Text style={styles.restrictedLabel}>Avoids:</Text>
              <View style={styles.ingredientChips}>
                {item.restrictedIngredients.slice(0, 4).map((ingredient, index) => (
                  <Chip key={index} style={styles.ingredientChip} mode="outlined">
                    {ingredient}
                  </Chip>
                ))}
                {item.restrictedIngredients.length > 4 && (
                  <Chip style={styles.ingredientChip} mode="outlined">
                    +{item.restrictedIngredients.length - 4} more
                  </Chip>
                )}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder="Search dietary preferences..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Text style={styles.selectedCount}>
          {selectedPreferences.length} preference(s) selected
        </Text>
      </Surface>

      {/* Preferences List */}
      <FlatList
        data={filteredPreferences}
        renderItem={renderPreferenceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Save Button */}
      <Surface style={styles.saveContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          Save Dietary Preferences
        </Button>
      </Surface>
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
  selectedCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  preferenceCard: {
    marginBottom: 15,
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  preferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 10,
  },
  preferenceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  restrictedSection: {
    marginTop: 10,
  },
  restrictedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    elevation: 8,
  },
  saveButton: {
    borderRadius: 25,
  },
  saveButtonContent: {
    height: 50,
  },
});