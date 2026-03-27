import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';

export type ProductsStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: number; title: string };
};

export type TabParamList = {
  ProductsTab: undefined;
  FavoritesTab: undefined;
};

export type ProductListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProductsStackParamList, 'ProductList'>,
  BottomTabScreenProps<TabParamList>
>;

export type ProductDetailScreenProps = NativeStackScreenProps<
  ProductsStackParamList,
  'ProductDetail'
>;

export type FavoritesScreenProps = BottomTabScreenProps<TabParamList, 'FavoritesTab'>;

export type ProductListNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProductsStackParamList, 'ProductList'>,
  BottomTabNavigationProp<TabParamList>
>;
