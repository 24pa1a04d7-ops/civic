import React from 'react';
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
  Chip,
  ProgressBar,
  List,
  Divider,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { RootStackParamList, AnalysisResult } from '../types';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ResultsScreenRouteProp = {
  params: {
    analysisResult: AnalysisResult;
  };
};

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const theme = useTheme();
  const { analysisResult } = route.params;

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

  const getSafetyMessage = (safety: string) => {
    switch (safety) {
      case 'safe': return 'This product appears safe for your dietary needs';
      case 'caution': return 'This product has some ingredients to be cautious about';
      case 'warning': return 'This product contains ingredients you should limit';
      case 'danger': return 'This product contains ingredients you should avoid';
      default: return 'Analysis complete';
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

  const handleViewAlternatives = () => {
    navigation.navigate('Alternatives', { alternatives: analysisResult.alternatives });
  };

  const handleScanAnother = () => {
    navigation.navigate('Scanner');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overall Safety Header */}
      <LinearGradient
        colors={[getSafetyColor(analysisResult.overallSafety), getSafetyColor(analysisResult.overallSafety) + '80']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Icon 
            name={getSafetyIcon(analysisResult.overallSafety)} 
            size={60} 
            color="white" 
          />
          <Title style={styles.safetyTitle}>
            {analysisResult.overallSafety.toUpperCase()}
          </Title>
          <Paragraph style={styles.safetyMessage}>
            {getSafetyMessage(analysisResult.overallSafety)}
          </Paragraph>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Nutritional Score */}
        <Card style={styles.scoreCard}>
          <Card.Content>
            <View style={styles.scoreHeader}>
              <Title style={styles.sectionTitle}>Nutritional Score</Title>
              <Text style={styles.scoreValue}>
                {analysisResult.nutritionalAnalysis.score}/100
              </Text>
            </View>
            <ProgressBar 
              progress={analysisResult.nutritionalAnalysis.score / 100} 
              color={analysisResult.nutritionalAnalysis.score > 70 ? theme.colors.success : 
                     analysisResult.nutritionalAnalysis.score > 40 ? '#FF9800' : theme.colors.error}
              style={styles.progressBar}
            />
            
            {/* Nutritional Strengths */}
            {analysisResult.nutritionalAnalysis.strengths.length > 0 && (
              <View style={styles.nutritionSection}>
                <Text style={styles.nutritionLabel}>Strengths:</Text>
                {analysisResult.nutritionalAnalysis.strengths.map((strength, index) => (
                  <View key={index} style={styles.nutritionItem}>
                    <Icon name="check" size={16} color={theme.colors.success} />
                    <Text style={styles.nutritionText}>{strength}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Nutritional Concerns */}
            {analysisResult.nutritionalAnalysis.concerns.length > 0 && (
              <View style={styles.nutritionSection}>
                <Text style={styles.nutritionLabel}>Concerns:</Text>
                {analysisResult.nutritionalAnalysis.concerns.map((concern, index) => (
                  <View key={index} style={styles.nutritionItem}>
                    <Icon name="warning" size={16} color="#FF9800" />
                    <Text style={styles.nutritionText}>{concern}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Flagged Ingredients */}
        {analysisResult.flaggedIngredients.length > 0 && (
          <Card style={styles.flaggedCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Flagged Ingredients</Title>
              {analysisResult.flaggedIngredients.map((flagged, index) => (
                <Surface key={index} style={styles.flaggedItem}>
                  <View style={styles.flaggedHeader}>
                    <Text style={styles.ingredientName}>
                      {flagged.ingredient.name}
                    </Text>
                    <Chip
                      style={[
                        styles.severityChip,
                        { backgroundColor: getSeverityColor(flagged.severity) }
                      ]}
                      textStyle={{ color: 'white', fontSize: 12 }}
                    >
                      {flagged.severity.toUpperCase()}
                    </Chip>
                  </View>
                  <Text style={styles.flaggedReason}>{flagged.reason}</Text>
                  {flagged.affectedConditions.length > 0 && (
                    <Text style={styles.affectedConditions}>
                      Affects: {flagged.affectedConditions.join(', ')}
                    </Text>
                  )}
                  {flagged.suggestions.length > 0 && (
                    <View style={styles.suggestions}>
                      {flagged.suggestions.map((suggestion, idx) => (
                        <Text key={idx} style={styles.suggestionText}>
                          • {suggestion}
                        </Text>
                      ))}
                    </View>
                  )}
                </Surface>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Recommendations */}
        {analysisResult.recommendations.length > 0 && (
          <Card style={styles.recommendationsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Recommendations</Title>
              {analysisResult.recommendations.map((recommendation, index) => (
                <List.Item
                  key={index}
                  title={recommendation.title}
                  description={recommendation.description}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon={
                        recommendation.type === 'avoid' ? 'cancel' :
                        recommendation.type === 'limit' ? 'warning' :
                        recommendation.type === 'substitute' ? 'swap-horiz' :
                        'info'
                      }
                      color={
                        recommendation.priority === 'high' ? theme.colors.error :
                        recommendation.priority === 'medium' ? '#FF9800' :
                        theme.colors.primary
                      }
                    />
                  )}
                  style={styles.recommendationItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {analysisResult.alternatives.length > 0 && (
            <Button
              mode="contained"
              onPress={handleViewAlternatives}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.actionButtonContent}
            >
              View Alternatives
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={handleScanAnother}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
          >
            Scan Another Product
          </Button>
        </View>
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  safetyTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  safetyMessage: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  scoreCard: {
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  nutritionSection: {
    marginBottom: 15,
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  nutritionText: {
    marginLeft: 8,
    flex: 1,
  },
  flaggedCard: {
    marginBottom: 20,
    elevation: 4,
  },
  flaggedItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  flaggedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityChip: {
    marginLeft: 10,
  },
  flaggedReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  affectedConditions: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  suggestions: {
    marginTop: 5,
  },
  suggestionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  recommendationsCard: {
    marginBottom: 20,
    elevation: 4,
  },
  recommendationItem: {
    paddingVertical: 5,
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 25,
  },
  actionButtonContent: {
    height: 50,
  },
});