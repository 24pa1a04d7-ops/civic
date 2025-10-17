import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  useTheme,
  Chip,
  List,
  Divider,
  Button,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, FoodProduct } from '../types';
import { StorageService } from '../services/storageService';

type ProductDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ProductDetailsScreenRouteProp = {
  params: {
    productId: string;
  };
};

export default function ProductDetailsScreen() {
  const navigation = useNavigation<ProductDetailsScreenNavigationProp>();
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const theme = useTheme();
  const { productId } = route.params;
  const [product, setProduct] = useState<FoodProduct | null>(null);

  const storageService = new StorageService();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const productData = await storageService.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preservative': return '#FF5722';
      case 'artificial_color': return '#E91E63';
      case 'artificial_flavor': return '#9C27B0';
      case 'sweetener': return '#3F51B5';
      case 'natural': return '#4CAF50';
      case 'protein': return '#2196F3';
      case 'carbohydrate': return '#FF9800';
      case 'fat': return '#795548';
      case 'vitamin': return '#8BC34A';
      case 'mineral': return '#607D8B';
      default: return theme.colors.primary;
    }
  };

  const getHealthImpactColor = (level: string) => {
    switch (level) {
      case 'safe': return '#4CAF50';
      case 'caution': return '#FF9800';
      case 'warning': return '#FF5722';
      case 'danger': return '#D32F2F';
      default: return theme.colors.primary;
    }
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          {product.imageUri && (
            <Image source={{ uri: product.imageUri }} style={styles.productImage} />
          )}
          <Title style={styles.productName}>{product.name}</Title>
          {product.brand && (
            <Text style={styles.brandName}>{product.brand}</Text>
          )}
          <Text style={styles.scanDate}>
            Scanned on {new Date(product.scannedAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      {/* Nutritional Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Nutritional Information</Title>
          <Text style={styles.servingSize}>
            Per serving ({product.nutritionalInfo.servingSize})
          </Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.carbohydrates}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.fat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.fiber}g</Text>
              <Text style={styles.nutritionLabel}>Fiber</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.sugar}g</Text>
              <Text style={styles.nutritionLabel}>Sugar</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{product.nutritionalInfo.sodium}mg</Text>
              <Text style={styles.nutritionLabel}>Sodium</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Ingredients List */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Ingredients</Title>
          <Text style={styles.ingredientsNote}>
            Listed in order of quantity (highest to lowest)
          </Text>
          
          {product.ingredients.map((ingredient, index) => (
            <View key={index}>
              <List.Item
                title={ingredient.name}
                description={`Category: ${ingredient.category.replace('_', ' ')}`}
                left={() => (
                  <View style={styles.ingredientIndex}>
                    <Text style={styles.indexNumber}>{index + 1}</Text>
                  </View>
                )}
                right={() => (
                  <View style={styles.ingredientTags}>
                    <Chip
                      style={[
                        styles.categoryChip,
                        { backgroundColor: getCategoryColor(ingredient.category) }
                      ]}
                      textStyle={{ color: 'white', fontSize: 10 }}
                    >
                      {ingredient.category.replace('_', ' ').toUpperCase()}
                    </Chip>
                    {ingredient.isAllergen && (
                      <Chip
                        style={styles.allergenChip}
                        textStyle={{ color: 'white', fontSize: 10 }}
                      >
                        ALLERGEN
                      </Chip>
                    )}
                    <Chip
                      style={[
                        styles.healthChip,
                        { backgroundColor: getHealthImpactColor(ingredient.healthImpact.level) }
                      ]}
                      textStyle={{ color: 'white', fontSize: 10 }}
                    >
                      {ingredient.healthImpact.level.toUpperCase()}
                    </Chip>
                  </View>
                )}
                style={styles.ingredientItem}
              />
              
              {ingredient.healthImpact.reasons.length > 0 && (
                <View style={styles.healthReasons}>
                  {ingredient.healthImpact.reasons.map((reason, reasonIndex) => (
                    <Text key={reasonIndex} style={styles.reasonText}>
                      • {reason}
                    </Text>
                  ))}
                </View>
              )}
              
              {index < product.ingredients.length - 1 && (
                <Divider style={styles.ingredientDivider} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Product Barcode */}
      {product.barcode && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Product Information</Title>
            <List.Item
              title="Barcode"
              description={product.barcode}
              left={(props) => <List.Icon {...props} icon="barcode" />}
            />
          </Card.Content>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Scanner')}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          Scan Another Product
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 15,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brandName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  scanDate: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  ingredientsNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  ingredientItem: {
    paddingVertical: 5,
  },
  ingredientIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ingredientTags: {
    alignItems: 'flex-end',
  },
  categoryChip: {
    marginBottom: 4,
  },
  allergenChip: {
    backgroundColor: '#D32F2F',
    marginBottom: 4,
  },
  healthChip: {
    marginBottom: 4,
  },
  healthReasons: {
    marginLeft: 50,
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  ingredientDivider: {
    marginVertical: 10,
  },
  actions: {
    padding: 15,
    paddingBottom: 30,
  },
  actionButton: {
    borderRadius: 25,
  },
  actionButtonContent: {
    height: 50,
  },
});