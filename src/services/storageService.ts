import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ScanSession, FoodProduct, AnalysisResult } from '../types';

export class StorageService {
  private static readonly KEYS = {
    USER_PROFILE: 'user_profile',
    SCAN_HISTORY: 'scan_history',
    PRODUCTS: 'products',
    SETTINGS: 'app_settings'
  };

  // User Profile Management
  async saveUserProfile(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw new Error('Failed to save user profile');
    }
  }

  async getUserProfile(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(StorageService.KEYS.USER_PROFILE);
      if (userJson) {
        const user = JSON.parse(userJson);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        user.updatedAt = new Date(user.updatedAt);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUserProfile();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...updates,
          updatedAt: new Date()
        };
        await this.saveUserProfile(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  // Scan History Management
  async saveScanSession(session: ScanSession): Promise<void> {
    try {
      const history = await this.getScanHistory();
      history.unshift(session); // Add to beginning of array
      
      // Keep only last 100 scans
      const limitedHistory = history.slice(0, 100);
      
      await AsyncStorage.setItem(StorageService.KEYS.SCAN_HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving scan session:', error);
      throw new Error('Failed to save scan session');
    }
  }

  async getScanHistory(): Promise<ScanSession[]> {
    try {
      const historyJson = await AsyncStorage.getItem(StorageService.KEYS.SCAN_HISTORY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        // Convert date strings back to Date objects
        return history.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          product: {
            ...session.product,
            scannedAt: new Date(session.product.scannedAt)
          }
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading scan history:', error);
      return [];
    }
  }

  async deleteScanSession(sessionId: string): Promise<void> {
    try {
      const history = await this.getScanHistory();
      const filteredHistory = history.filter(session => session.id !== sessionId);
      await AsyncStorage.setItem(StorageService.KEYS.SCAN_HISTORY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error deleting scan session:', error);
      throw new Error('Failed to delete scan session');
    }
  }

  async clearScanHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(StorageService.KEYS.SCAN_HISTORY);
    } catch (error) {
      console.error('Error clearing scan history:', error);
      throw new Error('Failed to clear scan history');
    }
  }

  // Product Management
  async saveProduct(product: FoodProduct): Promise<void> {
    try {
      const products = await this.getProducts();
      const existingIndex = products.findIndex(p => p.id === product.id);
      
      if (existingIndex >= 0) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }
      
      await AsyncStorage.setItem(StorageService.KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving product:', error);
      throw new Error('Failed to save product');
    }
  }

  async getProducts(): Promise<FoodProduct[]> {
    try {
      const productsJson = await AsyncStorage.getItem(StorageService.KEYS.PRODUCTS);
      if (productsJson) {
        const products = JSON.parse(productsJson);
        // Convert date strings back to Date objects
        return products.map((product: any) => ({
          ...product,
          scannedAt: new Date(product.scannedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  async getProduct(productId: string): Promise<FoodProduct | null> {
    try {
      const products = await this.getProducts();
      return products.find(product => product.id === productId) || null;
    } catch (error) {
      console.error('Error loading product:', error);
      return null;
    }
  }

  // Settings Management
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  async getSettings(): Promise<any> {
    try {
      const settingsJson = await AsyncStorage.getItem(StorageService.KEYS.SETTINGS);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      return {
        notifications: true,
        hapticFeedback: true,
        autoSave: true,
        theme: 'light'
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        StorageService.KEYS.USER_PROFILE,
        StorageService.KEYS.SCAN_HISTORY,
        StorageService.KEYS.PRODUCTS,
        StorageService.KEYS.SETTINGS
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  async exportData(): Promise<string> {
    try {
      const [user, history, products, settings] = await Promise.all([
        this.getUserProfile(),
        this.getScanHistory(),
        this.getProducts(),
        this.getSettings()
      ]);

      const exportData = {
        user,
        scanHistory: history,
        products,
        settings,
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importData(dataJson: string): Promise<void> {
    try {
      const data = JSON.parse(dataJson);
      
      if (data.user) {
        await this.saveUserProfile(data.user);
      }
      
      if (data.scanHistory) {
        await AsyncStorage.setItem(StorageService.KEYS.SCAN_HISTORY, JSON.stringify(data.scanHistory));
      }
      
      if (data.products) {
        await AsyncStorage.setItem(StorageService.KEYS.PRODUCTS, JSON.stringify(data.products));
      }
      
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }
}