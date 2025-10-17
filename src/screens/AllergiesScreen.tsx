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
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, User, Allergy } from '../types';
import { StorageService } from '../services/storageService';
import { COMMON_ALLERGIES } from '../constants/allergies';

type AllergiesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function AllergiesScreen() {
  const navigation = useNavigation<AllergiesScreenNavigationProp>();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAllergies, setFilteredAllergies] = useState(COMMON_ALLERGIES);
  const [isSaving, setIsSaving] = useState(false);

  const storageService = new StorageService();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    filterAllergies();
  }, [searchQuery]);

  const loadUserProfile = async () => {
    try {
      const userData = await storageService.getUserProfile();
      if (userData) {
        setUser(userData);
        setSelectedAllergies(userData.allergies.map(a => a.id));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const filterAllergies = () => {
    if (searchQuery.trim()) {
      const filtered = COMMON_ALLERGIES.filter(allergy =>
        allergy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allergy.allergens.some(allergen =>
          allergen.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredAllergies(filtered);
    } else {
      setFilteredAllergies(COMMON_ALLERGIES);
    }
  };

  const handleAllergyToggle = (allergyId: string) => {
    setSelectedAllergies(prev => {
      if (prev.includes(allergyId)) {
        return prev.filter(id => id !== allergyId);
      } else {
        return [...prev, allergyId];
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

      const selectedUserAllergies = COMMON_ALLERGIES
        .filter(allergy => selectedAllergies.includes(allergy.id))
        .map(allergy => ({ id: allergy.id }));

      const updatedUser = {
        ...user,
        allergies: selectedUserAllergies,
        updatedAt: new Date(),
      };

      await storageService.saveUserProfile(updatedUser);
      setUser(updatedUser);
      
      Alert.alert('Success', 'Allergies updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving allergies:', error);
      Alert.alert('Error', 'Failed to save allergies. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#FFC107';
      case 'moderate': return '#FF9800';
      case 'severe': return '#FF5722';
      case 'anaphylactic': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return 'info';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      case 'anaphylactic': return 'dangerous';
      default: return 'help';
    }
  };

  const renderAllergyItem = ({ item }: { item: Allergy }) => {
    const isSelected = selectedAllergies.includes(item.id);
    
    return (
      <Card style={[styles.allergyCard, isSelected && styles.selectedCard]}>
        <Card.Content>
          <View style={styles.allergyHeader}>
            <View style={styles.allergyInfo}>
              <Title style={styles.allergyName}>{item.name}</Title>
              <Chip
                icon={() => (
                  <Icon 
                    name={getSeverityIcon(item.severity)} 
                    size={16} 
                    color="white"
                  />
                )}
                style={[styles.severityChip, { backgroundColor: getSeverityColor(item.severity) }]}
                textStyle={{ color: 'white', fontSize: 12 }}
              >
                {item.severity.toUpperCase()}
              </Chip>
            </View>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => handleAllergyToggle(item.id)}
              color={theme.colors.primary}
            />
          </View>
          
          {item.severity === 'anaphylactic' && (
            <View style={styles.warningSection}>
              <Icon name="warning" size={20} color={theme.colors.error} />
              <Text style={styles.warningText}>
                This allergy can cause life-threatening reactions
              </Text>
            </View>
          )}
          
          {item.allergens.length > 0 && (
            <View style={styles.allergensSection}>
              <Text style={styles.allergensLabel}>Common Sources:</Text>
              <View style={styles.allergenChips}>
                {item.allergens.slice(0, 6).map((allergen, index) => (
                  <Chip key={index} style={styles.allergenChip} mode="outlined">
                    {allergen}
                  </Chip>
                ))}
                {item.allergens.length > 6 && (
                  <Chip style={styles.allergenChip} mode="outlined">
                    +{item.allergens.length - 6} more
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
          placeholder="Search allergies..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Text style={styles.selectedCount}>
          {selectedAllergies.length} allerg{selectedAllergies.length === 1 ? 'y' : 'ies'} selected
        </Text>
        
        {selectedAllergies.some(id => {
          const allergy = COMMON_ALLERGIES.find(a => a.id === id);
          return allergy?.severity === 'anaphylactic';
        }) && (
          <View style={styles.criticalWarning}>
            <Icon name="warning" size={20} color={theme.colors.error} />
            <Text style={styles.criticalWarningText}>
              You have selected severe allergies. Please ensure emergency medication is available.
            </Text>
          </View>
        )}
      </Surface>

      {/* Allergies List */}
      <FlatList
        data={filteredAllergies}
        renderItem={renderAllergyItem}
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
          Save Allergies
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
    marginBottom: 10,
  },
  criticalWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  criticalWarningText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  allergyCard: {
    marginBottom: 15,
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  allergyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  allergyInfo: {
    flex: 1,
    marginRight: 10,
  },
  allergyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  severityChip: {
    alignSelf: 'flex-start',
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  warningText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
  },
  allergensSection: {
    marginTop: 10,
  },
  allergensLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  allergenChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenChip: {
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