# Perch React Native - Quick Start Guide

## What Was Done

✅ **Complete port** of the Perch React web app to React Native using Expo Router.

### Main Changes from Web to Native

1. **Navigation**: React Router → Expo Router (file-based routing)
2. **Styling**: Tailwind CSS + shadcn/ui → React Native StyleSheet
3. **Components**: HTML/CSS → React Native components (View, Text, Image, ScrollView, etc.)
4. **Data**: Same mock data structure in `constants/data.ts`

## File Structure Overview

```
✨ Tab Screens (Main Navigation):
  app/(tabs)/index.tsx         → Feed (home page)
  app/(tabs)/explore.tsx       → Explore with search/filters
  app/(tabs)/create.tsx        → Create options menu
  app/(tabs)/inspo.tsx         → Inspiration boards
  app/(tabs)/profile.tsx       → User profile

📋 Content Creation:
  app/post/new.tsx             → Create new post
  app/board/new.tsx            → Create new collection
  app/inspo/new.tsx            → Create inspiration (placeholder)

📄 Detail Views (Placeholders - ready to build):
  app/post/[id].tsx            → Post detail
  app/inspo/[id].tsx           → Inspo detail
  app/collection/[id].tsx      → Collection detail
  app/profile/edit.tsx         → Edit profile
  app/saved.tsx                → Saved items

📦 Data:
  constants/data.ts            → All mock data from web app
```

## Key Features Implemented

### ✅ Feed Screen
- Shows all posts in reverse chronological order
- User info (avatar, name, handle)
- Double-tap to like with animation
- Category badges
- Action buttons

### ✅ Explore Screen  
- Search for places and users
- Filter by category tags
- Grid layout showing both users and places
- Excludes your own posts

### ✅ Profile Screen
- Banner and profile picture
- Follower/following stats
- Two tabs: Boards and Posts
- Grid layout of your content

### ✅ Create Options
- Quick access to create post/board/inspo
- Direct links to creation flows

### ✅ New Post Form
- Category selection
- Image upload area
- Name, description, notes inputs
- Price and rating selections

### ✅ New Board Form
- Banner image upload
- Board name and location
- Public/Private toggle

## How to Test

### Run on iOS Simulator
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

### Run on Web
```bash
npm run web
```

## Navigation Examples

### Tab Navigation (Automatic)
Users can tap the bottom tabs to navigate between:
- Feed
- Explore  
- Create
- Inspo
- Profile

### Programmatic Navigation
```tsx
// From create screen to new post
<Link href="/board/new" asChild>
  <TouchableOpacity>Create Board</TouchableOpacity>
</Link>

// Back navigation
router.back();
```

## Data Updates

All data comes from `constants/data.ts`:
```tsx
import { users, places, collections, inspoBoards } from '@/constants/data';
```

To update data:
1. Modify `constants/data.ts` directly (for testing)
2. Later: Replace with backend API calls

## Customization Points

### Styling
Edit `StyleSheet.create()` blocks in each screen file to customize colors, spacing, fonts.

### Data
Update `constants/data.ts` with real data or API endpoints.

### Features
- Placeholders ready for full implementation
- Add more complex interactions to post detail screens
- Implement real backend API calls

## Common Tasks

### Add a New Screen
1. Create file in appropriate folder: `app/feature-name.tsx` or `app/feature/[id].tsx`
2. Export default component
3. Add navigation link where needed

### Update Feed Layout
Edit styles in `app/(tabs)/index.tsx`, specifically the `PostItem` component styling.

### Add Search/Filter
Modify `app/(tabs)/explore.tsx` to add more filter options or search logic.

### Connect to Backend
Replace mock data in `constants/data.ts` with API calls using `fetch` or `axios`.

## Dependencies

### Already Installed
- `expo` & `expo-router` - Navigation
- `react-native` - Core framework
- `nativewind` - Tailwind support
- `lucide-react-native` - Icons
- `@react-navigation/*` - Navigation utilities

### Might Need Later
- `@supabase/supabase-js` - Backend
- `zustand` or `@reduxjs/toolkit` - State management
- `react-native-image-picker` - Image selection

## Debugging

### Check Console
```bash
# View logs while running
npm run ios -- --clear
npm run android -- --clear
```

### React DevTools
Enable in Expo client for debugging state and components.

### Navigation Issues
- Verify folder/file names match route paths
- Check that `_layout.tsx` files are in correct locations
- Ensure all `<Link>` hrefs match actual routes

## Next Steps

1. **Test the app**: Run on simulator/emulator
2. **Fill in placeholders**: Implement the gray placeholder screens
3. **Add styling**: Customize colors/spacing to match design
4. **Connect backend**: Replace mock data with real API
5. **Add features**: Comments, likes, notifications, etc.

## Support

Check these files for detailed information:
- `PORTING_SUMMARY.md` - What was ported and how
- `IMPLEMENTATION_GUIDE.md` - Architecture and design patterns
- `README.md` - Original project info

---

**Status**: ✅ Ready to test and develop
**Latest Update**: May 1, 2026
