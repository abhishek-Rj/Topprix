# Predefined Categories System

## Overview

The app now uses a predefined categories and subcategories system instead of allowing users to create their own categories. This ensures consistency and better organization across the platform.

## Category Structure

### 1. ⭐ Shops & Offers (Top Priority)

- **Hypermarkets & Supermarkets** - Top priority placement with large banners
- Home Appliances / High-Tech
- Furniture & Décor
- DIY & Gardening
- Fashion & Accessories
- Beauty & Perfumery
- Baby & Kids
- Local / Organic Products

### 2. 🛠 Services & Professionals

- Employment / Recruitment
- Home Services (cleaning, gardening, babysitting)
- Driving Schools / Training
- Health & Wellness (osteopathy, spa, treatments)
- Repair Services / Technicians
- Craftsmen / Construction

### 3. 🎉 Leisure & Tourism

- Restaurants
- Hotels & Guesthouses
- Travel & Agencies
- Events / Concerts
- Sports / Fitness
- Culture / Outings

### 4. 🚗 Auto / Moto / Mobility

- Vehicle Sales
- Car Rentals
- Mechanics / Bodywork
- Accessories / Tires

### 5. 🏡 Real Estate

- Houses for Sale
- Apartments for Sale
- Land for Sale
- Commercial Properties for Sale
- Houses for Rent
- Apartments for Rent
- Seasonal Rentals / Holiday Homes
- Rent-to-Own Properties
- Properties for Sale in Viager
- Real Estate Agencies & Services

### 6. 📢 Announcements

- Buy & Sell (Various items, furniture, appliances…)
- Job Offers (General employment offers)
- Services Offered (Various services)
- Exchanges & Donations
- Community Announcements

## Implementation

### Components Updated

1. **PredefinedCategorySelector.tsx** - New component for category selection
2. **FloatingSidebar.tsx** - Updated to use predefined categories
3. **Flyer.tsx** - Updated to use new sidebar
4. **Coupon.tsx** - Updated to use new sidebar
5. **createNewStore.tsx** - Updated to use new category selector
6. **Store.tsx** - Updated to use new category selector

### Features

- **Hierarchical Selection**: Categories can be expanded to show subcategories
- **Priority System**: Shops & Offers gets top priority with star icon
- **Visual Icons**: Each category has a relevant emoji icon
- **Responsive Design**: Works on both desktop and mobile
- **Theme Aware**: Adapts colors based on user role (Admin = Blue, Others = Yellow)

### State Management

- `selectedCategories`: Array of selected category IDs
- `selectedSubcategory`: Currently selected subcategory ID
- `expandedCategories`: Array of expanded category IDs for UI

## Usage

### For Store Creation

```tsx
<PredefinedCategorySelector
  selectedCategories={selectedCategories}
  selectedSubcategories={selectedSubcategories}
  onCategoryChange={setSelectedCategories}
  onSubcategoryChange={setSelectedSubcategories}
  allowMultiple={true}
/>
```

### For Flyer/Coupon Creation

```tsx
<PredefinedCategorySelector
  selectedCategories={selectedCategories}
  selectedSubcategories={selectedSubcategories}
  onCategoryChange={setSelectedCategories}
  onSubcategoryChange={setSelectedSubcategories}
  allowMultiple={true}
/>
```

### For Filtering (Floating Sidebar)

```tsx
<FloatingSidebar
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  selectedSubcategory={selectedSubcategory}
  onSubcategoryChange={setSelectedSubcategory}
  sortBy={sortBy}
  onSortChange={setSortBy}
  isOpen={isSidebarOpen}
  onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
  userRole={userRole}
/>
```

## Benefits

1. **Consistency**: All stores, flyers, and coupons use the same category system
2. **Better UX**: Users don't need to create categories, just select from predefined options
3. **Organization**: Content is automatically organized into logical groups
4. **Searchability**: Better filtering and search capabilities
5. **Scalability**: Easy to add new categories without user input
6. **Localization**: Categories can be easily translated to different languages

## Future Enhancements

- Add category-specific validation rules
- Implement category-based pricing tiers
- Add category-specific templates
- Implement category-based analytics
- Add category-specific features (e.g., real estate listings, job postings)

## Migration Notes

- **Old Category System**: The previous user-created categories system has been removed
- **API Changes**: Backend should now expect predefined category IDs instead of custom names
- **Data Migration**: Existing stores/flyers/coupons should be mapped to new categories
- **User Experience**: Users will see a cleaner, more organized category selection interface

## Technical Details

### Category IDs

- All category IDs are lowercase with hyphens (e.g., "shops-offers", "real-estate")
- Subcategory IDs follow the same pattern (e.g., "hypermarkets-supermarkets")
- IDs are consistent across all components and API calls

### Priority System

- Priority 1: Shops & Offers (gets special visual treatment)
- Priority 2-6: Other categories in order of importance
- Priority affects the order in which categories are displayed

### Responsive Behavior

- **Desktop**: Categories expand inline with subcategories
- **Mobile**: Full-screen overlay with touch-friendly interface
- **Tablet**: Adaptive layout based on screen size
