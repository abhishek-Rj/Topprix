# Floating Sidebar Feature

## Overview

A new floating sidebar has been implemented for both the Coupons and Flyers pages to provide an improved user experience for filtering and sorting content.

## Features

### Design

- **Floating Position**: The sidebar appears on the left side of the screen
- **Responsive**: Adapts to both desktop and mobile devices
- **Theme-Aware**: Automatically adjusts colors based on user role (Admin = Blue, Retailer/User = Yellow)
- **Smooth Animations**: Uses Framer Motion for smooth open/close transitions

### Functionality

- **Category Filtering**: Filter flyers/coupons by category
- **Sort Options**: Sort by active/inactive status
- **Quick Actions**: Clear all filters with one click
- **Mobile Optimized**: Full-screen overlay on mobile devices

### Components

#### FloatingSidebar.tsx

- Main sidebar component with all filtering logic
- Handles mobile vs desktop display
- Integrates with existing category and sort state

#### Updated Pages

- **Flyer.tsx**: Removed search bar, added floating sidebar
- **Coupon.tsx**: Removed search bar, added floating sidebar

## Implementation Details

### State Management

- `isSidebarOpen`: Controls sidebar visibility
- `selectedCategory`: Current category filter
- `sortBy`: Current sort option

### Props Interface

```typescript
interface FloatingSidebarProps {
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
}
```

### Styling

- Uses Tailwind CSS for consistent design
- Dynamic color schemes based on user role
- Responsive breakpoints for mobile/desktop

## Usage

### Opening/Closing

- **Desktop**: Click the floating filter button on the left side
- **Mobile**: Tap the filter button for full-screen overlay

### Filtering

1. Select a category from the sidebar
2. Choose sort option (All, Active, Inactive)
3. Use "Clear All Filters" to reset

## Benefits

1. **Better UX**: Cleaner interface without cluttered search bars
2. **Mobile Friendly**: Optimized for touch devices
3. **Consistent Design**: Matches existing app theme
4. **Performance**: Removes unnecessary search input processing
5. **Accessibility**: Clear visual hierarchy and intuitive controls

## Future Enhancements

- Add search functionality back to sidebar if needed
- Implement saved filter presets
- Add more sorting options (date, popularity, etc.)
- Keyboard navigation support
- Filter count badges

## Dependencies

- **Framer Motion**: For smooth animations
- **React Icons**: For UI icons
- **React i18n**: For internationalization
- **Tailwind CSS**: For styling
