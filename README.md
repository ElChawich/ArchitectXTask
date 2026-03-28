# Product Explorer

A React Native mobile app for browsing, searching, and favouriting products from [DummyJSON API](https://dummyjson.com/products). Supports English (LTR) and Arabic (RTL) with full layout mirroring, dark mode, and offline-persistent favourites.

---

## How to Run Locally

### Prerequisites
- Node.js >= 22
- Xcode (iOS) / Android Studio (Android)
- CocoaPods (iOS)

```bash
# 1. Install JS dependencies
npm install

# 2. iOS — install native pods
cd ios && pod install && cd ..

# 3. Start Metro bundler
npm start

# 4a. Run on iOS
npm run ios

# 4b. Run on Android
npm run android
```

### Test deep links
```bash
# iOS Simulator
xcrun simctl openurl booted "productexplorer://products/1"

# Android
adb shell am start -W -a android.intent.action.VIEW -d "productexplorer://products/1"
```

### Run unit tests
```bash
npm test
```

---

## Folder Structure

```
src/
├── api/              # All API calls and response types — no fetch() in components
│   ├── client.ts     # Base fetch wrapper with error handling
│   ├── products.ts   # Product/category endpoint functions
│   └── types.ts      # Full Product, Category, Response interfaces (strict, no any)
├── components/       # Shared, reusable UI components
│   ├── ProductCard.tsx     # Card with spring press animation + heart toggle
│   ├── SkeletonCard.tsx    # Pulse shimmer skeleton (Reanimated)
│   ├── HeartButton.tsx     # Bounce/pop animation on favourite toggle
│   ├── ImageGallery.tsx    # Paged horizontal scroll with dot indicators
│   ├── ErrorState.tsx      # Error UI with retry button
│   └── EmptyState.tsx      # Empty favourites state
├── features/
│   ├── products/
│   │   ├── screens/        # ProductListScreen, ProductDetailScreen
│   │   └── hooks/          # useProducts (infinite scroll), useProductDetail
│   └── favorites/
│       └── screens/        # FavoritesScreen
├── hooks/                  # Cross-feature hooks
│   ├── useDebounce.ts      # Generic debounce (300ms for search)
│   ├── useFavorites.ts     # Favourite toggle + haptic feedback
│   ├── useLanguage.ts      # Language toggle + RTL flag
│   └── useDarkMode.ts      # Dark mode toggle + colour palette
├── navigation/
│   ├── RootNavigator.tsx   # NavigationContainer + deep link config
│   ├── TabNavigator.tsx    # Bottom tabs + Products stack navigator
│   └── types.ts            # Typed navigation params (RN TypeScript guide)
├── store/
│   ├── favoritesStore.ts   # Zustand + MMKV — persisted favourites list
│   └── settingsStore.ts    # Zustand + MMKV — language + dark mode
├── i18n/
│   ├── index.ts            # i18next initialisation
│   └── translations/
│       ├── en.ts
│       └── ar.ts
└── theme/
    ├── colors.ts           # Light/dark colour palettes
    └── spacing.ts          # Spacing, border radius, font size tokens
```

**Why feature-based?**
Each feature (`products`, `favorites`) owns its screens and domain hooks. Shared concerns (components, global hooks, theme) live at the `src/` level. Adding a new feature is a self-contained folder — no cross-feature coupling required.

---

## Pagination vs Infinite Scroll

**Choice: Infinite Scroll**

- Mobile users expect continuous scrolling, not paginated "Next" buttons.
- `useInfiniteQuery` from TanStack Query provides clean automatic page tracking via `getNextPageParam`.
- DummyJSON's `limit/skip` API makes cursor-based loading trivial.
- **Trade-off documented**: memory accumulates with many pages. Acceptable here since users typically find products within the first 2–3 pages. A production app would add a virtualised window.

---

## State Management

**Zustand + MMKV** (Bonus item — replaces `useState`)

- **Zustand** is chosen over Redux Toolkit for minimal boilerplate and no mandatory Provider wrapping. Selector subscriptions prevent unnecessary re-renders.
- **MMKV** replaces AsyncStorage. It is synchronous, C++ native, and ~10× faster on benchmarks — no async hydration flicker on startup.
- Zustand's `persist` middleware handles JSON serialisation; MMKV provides the synchronous storage adapter.

Two stores:
1. `favoritesStore` — persisted `Product[]` array.
2. `settingsStore` — persisted `language` (`'en' | 'ar'`) and `isDarkMode`.

---

## i18n / RTL

**react-i18next** is used (i18next recommended in the spec). Justified: it provides React hooks (`useTranslation`), lazy namespace loading, and is the most widely adopted i18n solution in the React ecosystem.

**RTL without `I18nManager.forceRTL`**: System-level RTL via `I18nManager` requires an app restart and prevents animated transitions. Instead, `isRTL = language === Language.AR` drives conditional `flexDirection`, `textAlign`, and `direction` props throughout the app. This enables the live `LinearTransition.springify()` layout animation when switching languages. Language is persisted via MMKV and re-applied to `i18n` on app launch.

Prices, ratings, and stock counts are wrapped in explicit `flexDirection: 'row'` containers to remain LTR even within RTL layouts.

---

## Animations (Reanimated 3)

| Requirement | Implementation |
|---|---|
| Card press scale 0.96 | `useSharedValue` + `withSpring` on `pressIn/pressOut` |
| Skeleton shimmer/pulse | `withRepeat(withSequence(withTiming))` opacity loop |
| Heart bounce/pop | `withSequence(withSpring(1.5), withSpring(1))` |
| Language layout transition | `LinearTransition.springify()` on `Animated.View` |
| Tab icon scale on active | `withSpring(1.2)` driven by `focused` prop |
| Screen transition | `animation: 'slide_from_right'` in NativeStack options |

No `Animated` API from React Native core is used anywhere.

---

## Bonus Items Completed

- [x] **Zustand** state management (replaces useState)
- [x] **TanStack Query v5** for data fetching (replaces useEffect)
- [x] **Dark mode** toggle persisted to MMKV
- [x] **Unit tests** — `useDebounce` (5 cases) + `useFavorites` (5 cases) via Jest + React Native Testing Library
- [x] **Accessibility** — `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint` on all interactive elements
- [x] **Haptic feedback** on favourite toggle (`react-native-haptic-feedback`, vibration fallback enabled)

---

## Trade-offs

1. **RTL back arrow**: The native NativeStack back chevron doesn't auto-flip without `I18nManager`. Mitigated by showing `headerBackTitle` in Arabic mode. A custom `headerLeft` with a flipped SVG arrow was deferred for time.
2. **Search + category simultaneously**: DummyJSON doesn't support combined filters. Search takes priority when both are active; the UI clears search when a category is tapped.

---

## What I Would Improve Given More Time

1. Custom RTL-aware `headerLeft` with a Reanimated-mirrored back chevron.
2. Replace the built-in `Image` component with `react-native-fast-image` for better disk/memory caching, priority queuing, and progressive loading on product images.
3. E2E tests with Detox covering the product → detail → favourite → favourites tab flow.
4. Shared element transition from product card thumbnail to detail image gallery.
5. Virtualised/windowed list for infinite scroll to cap memory usage.
