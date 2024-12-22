import React, { useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getExpiryStatus, formatExpiryDate } from '../utils/expiryUtils';

const ProductItem = memo(({ item, onAddToCart }) => {
  const { status, color } = getExpiryStatus(item.expiryDate);
  const expiryText = formatExpiryDate(item.expiryDate);

  return (
    <Animated.View style={[styles.productCard, { borderLeftColor: color }]}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={[styles.expiryContainer, { backgroundColor: color }]}>
          <Ionicons
            name={status === 'expired' ? 'warning' : 'time-outline'}
            size={16}
            color="white"
          />
          <Text style={styles.expiryText}>{expiryText}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAddToCart(item)}
      >
        <Ionicons name="cart" size={24} color={THEME.colors.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const ProductList = () => {
  const { products, addToCart } = useApp();

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  const renderItem = useCallback(({ item }) => (
    <ProductItem item={item} onAddToCart={handleAddToCart} />
  ), [handleAddToCart]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="basket-outline"
        size={64}
        color={THEME.colors.textSecondary}
      />
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptySubtext}>
        Scan products to start tracking their expiry dates
      </Text>
    </View>
  ), []);

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: THEME.spacing.md,
    flexGrow: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  productPrice: {
    fontSize: 14,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  expiryText: {
    color: 'white',
    marginLeft: THEME.spacing.xs,
    fontSize: 12,
  },
  addButton: {
    justifyContent: 'center',
    paddingLeft: THEME.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
  },
});

export default memo(ProductList);
