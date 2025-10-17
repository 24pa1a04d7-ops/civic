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

import { RootStackParamList, User, HealthCondition } from '../types';
import { StorageService } from '../services/storageService';
import { HEALTH_CONDITIONS } from '../constants/healthConditions';

type HealthConditionsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HealthConditionsScreen() {
  const navigation = useNavigation<HealthConditionsScreenNavigationProp>();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConditions, setFilteredConditions] = useState(HEALTH_CONDITIONS);
  const [isSaving, setIsSaving] = useState(false);

  const storageService = new StorageService();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    filterConditions();
  }, [searchQuery]);

  const loadUserProfile = async () => {
    try {
      const userData = await storageService.getUserProfile();
      if (userData) {
        setUser(userData);
        setSelectedConditions(userData.healthConditions.map(hc => hc.id));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const filterConditions = () => {
    if (searchQuery.trim()) {
      const filtered = HEALTH_CONDITIONS.filter(condition =>
        condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        condition.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConditions(filtered);
    } else {
      setFilteredConditions(HEALTH_CONDITIONS);
    }
  };

  const handleConditionToggle = (conditionId: string) => {
    setSelectedConditions(prev => {
      if (prev.includes(conditionId)) {
        return prev.filter(id => id !== conditionId);
      } else {
        return [...prev, conditionId];
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

      const selectedHealthConditions = HEALTH_CONDITIONS
        .filter(condition => selectedConditions.includes(condition.id))
        .map(condition => ({ id: condition.id }));

      const updatedUser = {
        ...user,
        healthConditions: selectedHealthConditions,
        updatedAt: new Date(),
      };

      await storageService.saveUserProfile(updatedUser);
      setUser(updatedUser);
      
      Alert.alert('Success', 'Health conditions updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving health conditions:', error);
      Alert.alert('Error', 'Failed to save health conditions. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#FFC107';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'critical': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const renderConditionItem = ({ item }: { item: HealthCondition }) => {
    const isSelected = selectedConditions.includes(item.id);
    
    return (
      <Card style={[styles.conditionCard, isSelected && styles.selectedCard]}>
        <Card.Content>
          <View style={styles.conditionHeader}>
            <View style={styles.conditionInfo}>
              <Title style={styles.conditionName}>{item.name}</Title>
              <Chip
                style={[styles.severityChip, { backgroundColor: getSeverityColor(item.severity) }]}
                textStyle={{ color: 'white', fontSize: 12 }}
              >
                {item.severity.toUpperCase()}
              </Chip>
            </View>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => handleConditionToggle(item.id)}
              color={theme.colors.primary}
            />
          </View>
          
          <Text style={styles.conditionDescription}>{item.description}</Text>
          
          {item.restrictedIngredients.length > 0 && (
            <View style={styles.restrictedSection}>
              <Text style={styles.restrictedLabel}>Restricted Ingredients:</Text>
              <View style={styles.ingredientChips}>
                {item.restrictedIngredients.slice(0, 3).map((ingredient, index) => (
                  <Chip key={index} style={styles.ingredientChip} mode="outlined">
                    {ingredient}
                  </Chip>
                ))}
                {item.restrictedIngredients.length > 3 && (
                  <Chip style={styles.ingredientChip} mode="outlined">
                    +{item.restrictedIngredients.length - 3} more
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
          placeholder="Search health conditions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Text style={styles.selectedCount}>
          {selectedConditions.length} condition(s) selected
        </Text>
      </Surface>

      {/* Conditions List */}
      <FlatList
        data={filteredConditions}
        renderItem={renderConditionItem}
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
          Save Health Conditions
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
  conditionCard: {
    marginBottom: 15,
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  conditionInfo: {
    flex: 1,
    marginRight: 10,
  },
  conditionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  severityChip: {
    alignSelf: 'flex-start',
  },
  conditionDescription: {
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