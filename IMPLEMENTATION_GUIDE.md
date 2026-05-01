# Perch React Native Port - Implementation Guide

## Project Structure
```
app/
├── (tabs)/                          # Main tab navigation
│   ├── _layout.tsx                 # Tab configuration (5 tabs: Feed, Explore, Create, Inspo, Profile)
│   ├── index.tsx                   # Feed screen
│   ├── explore.tsx                 # Explore screen
│   ├── create.tsx                  # Create options screen
│   ├── inspo.tsx                   # Inspiration boards/posts
│   └── profile.tsx                 # User profile
├── post/
│   ├── new.tsx                     # Create new post
│   ├── select-board.tsx            # Select board for post
│   └── [id].tsx                    # Post detail view
├── board/
│   └── new.tsx                     # Create new collection/board
├── inspo/
│   ├── new.tsx                     # Create new inspiration
│   └── [id].tsx                    # Inspiration board detail
├── collection/
│   └── [id].tsx                    # Collection detail
├── profile/
│   └── edit.tsx                    # Edit profile
├── saved.tsx                        # Saved items
└── _layout.tsx                     # Root layout

constants/
├── data.ts                         # Mock data (ported from web)
├── theme.ts                        # Existing theme
└── ...

components/
├── (existing components maintained)
└── ...
```

## Web App vs React Native Mapping

### Pages Ported
| Web Route | RN Route | File | Status |
|-----------|----------|------|--------|
| / (Feed) | (tabs) | index.tsx | ✅ Full |
| /explore | (tabs)/explore | explore.tsx | ✅ Full |
| /profile | (tabs)/profile | profile.tsx | ✅ Full |
| /post/new | /post/new | post/new.tsx | ✅ Full |
| /board/new | /board/new | board/new.tsx | ✅ Full |
| /inspo/new | /inspo/new | inspo/new.tsx | ✅ Placeholder |
| /post/:id | /post/:id | post/[id].tsx | ✅ Placeholder |
| /inspo/:id | /inspo/:id | inspo/[id].tsx | ✅ Placeholder |
| /collection/:id | /collection/:id | collection/[id].tsx | ✅ Placeholder |
| /profile/edit | /profile/edit | profile/edit.tsx | ✅ Placeholder |
| /saved | /saved | saved.tsx | ✅ Placeholder |
| /post/select-board | /post/select-board | post/select-board.tsx | ✅ Placeholder |

### Navigation Differences
**Web**: React Router with path-based routing
```tsx
<Link to="/profile/edit">Edit Profile</Link>
```

**React Native**: Expo Router with file-based routing
```tsx
<Link href="/profile/edit">Edit Profile</Link>
```

## Component Architecture

### Implemented Components

#### 1. **Feed Screen** (`app/(tabs)/index.tsx`)
- **Features**:
  - Reverse-chronological feed of all places
  - Post items with user avatar, name, handle
  - Post image with double-tap animation for liking
  - Category badge
  - Action buttons (like, comment, save)
- **State Management**: 
  - isLiked, showHeartAnim for animations
  - Animated.spring for heart animation

#### 2. **Explore Screen** (`app/(tabs)/explore.tsx`)
- **Features**:
  - Search input for places/users
  - Category filter tags (horizontal scroll)
  - Grid layout for places (2-column)
  - User cards displayed above places when searching
  - Dynamic filtering based on search + category
- **Filters**: Categories, search query, excludes own posts

#### 3. **Create Screen** (`app/(tabs)/create.tsx`)
- **Features**:
  - Three options: Add Board, Add Post, Get Inspo
  - Icons for each option
  - Direct links to creation flows

#### 4. **Inspo Screen** (`app/(tabs)/inspo.tsx`)
- **Features**:
  - Two tabs: Boards and Posts
  - Grid layout for inspiration boards (2-column)
  - Grid layout for inspiration posts (3-column)
  - Shows only non-default user inspirations

#### 5. **Profile Screen** (`app/(tabs)/profile.tsx`)
- **Features**:
  - Banner image with overlay
  - Profile picture overlay on banner
  - Follower/following stats
  - Bio display
  - Two tabs: Boards and Posts
  - Grid layout of collections/posts (3-column)
  - Menu button with settings placeholder

#### 6. **New Post Screen** (`app/post/new.tsx`)
- **Features**:
  - Category selection (horizontal scroll)
  - Image upload area
  - Form fields: name, description, notes
  - Price selection (Free/NA, $, $$, $$$)
  - Star rating (1-5)
  - Publish button

#### 7. **New Board Screen** (`app/board/new.tsx`)
- **Features**:
  - Banner image upload
  - Name and location inputs
  - Public/Private toggle
  - Create button

## Data Flow

### Mock Data (`constants/data.ts`)
All data is imported from a centralized source:
```tsx
import { 
  users, 
  currentUser, 
  collections, 
  places,
  inspoBoards,
  inspoPlaces,
  savedItems,
  postDetailStreamPlaces
} from '@/constants/data';
```

### Data Structure
- **users**: Array of user objects with profiles
- **currentUser**: Currently logged-in user (users[0])
- **collections**: User-created boards
- **places**: Posts/place cards
- **inspoBoards**: Inspiration collections
- **inspoPlaces**: Inspiration posts
- **savedItems**: User's saved places/collections

## Styling Approach

### Removed
- Tailwind CSS classes
- CSS modules
- Shadcn/ui components
- Radix UI primitives

### Added
- React Native StyleSheet
- Direct inline styles where appropriate
- NativeWind compatibility (though not heavily used)

### Style Examples
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});
```

## Navigation Implementation

### Tab Navigation
```tsx
<Tabs screenOptions={{ ... }}>
  <Tabs.Screen name="index" options={{ title: 'Feed', ... }} />
  <Tabs.Screen name="explore" options={{ title: 'Explore', ... }} />
  <Tabs.Screen name="create" options={{ title: 'Create', ... }} />
  <Tabs.Screen name="inspo" options={{ title: 'Inspo', ... }} />
  <Tabs.Screen name="profile" options={{ title: 'Profile', ... }} />
</Tabs>
```

### Dynamic Routes
- `/post/[id]` - Dynamic post detail
- `/inspo/[id]` - Dynamic inspo board detail
- `/collection/[id]` - Dynamic collection detail

### Navigation Patterns
```tsx
// Link navigation
<Link href="/board/new" asChild>
  <TouchableOpacity>...</TouchableOpacity>
</Link>

// Programmatic navigation
import { router } from 'expo-router';
router.back();
router.push('/post/new');
```

## Animations

### Heart Animation (Feed)
- Uses `Animated.spring()` for the like heart
- Scales from 0 to 1 with spring effect
- Duration: 800ms visibility

### Future Enhancements
- Parallax scrolling
- Gesture animations
- Transition animations between screens

## Known Limitations & Placeholders

### Full Implementation
- ✅ Feed
- ✅ Explore with search/filtering
- ✅ Profile view
- ✅ Create menu
- ✅ Inspo boards/posts view
- ✅ New Post creation form
- ✅ New Board creation form

### Placeholder Screens
- 🟡 Post Detail (basic layout)
- 🟡 Inspo Detail (basic layout)
- 🟡 Collection Detail (basic layout)
- 🟡 Edit Profile (basic layout)
- 🟡 Saved Items (basic layout)
- 🟡 Select Board for Post (basic layout)
- 🟡 New Inspo (basic layout)

These placeholder screens are ready for full implementation but currently just show the basic structure and navigation.

## Backend Integration Notes

When integrating Supabase or other backend:

1. **Replace mock data** in `constants/data.ts` with API calls
2. **Add context/state management** (Redux, Zustand, or Context API)
3. **Implement authentication** flow
4. **Replace file uploads** with real image upload service
5. **Add loading states** during data fetching
6. **Implement error handling** and retry logic

## Testing Recommendations

1. **Navigation**: Verify all route transitions work
2. **Data Display**: Check all screens render data correctly
3. **Interactions**: Test double-tap likes, filtering, tab switching
4. **Animations**: Verify heart animation on iOS/Android
5. **Layouts**: Test on various screen sizes
6. **Performance**: Monitor re-render performance with large datasets

## Performance Considerations

1. **FlatList for Lists**: Replace ScrollView with FlatList for large lists
2. **Image Optimization**: Compress images before upload
3. **Memoization**: Use React.memo() for expensive components
4. **State Management**: Implement proper state structure to avoid unnecessary re-renders

## Next Development Phases

### Phase 1: Polish
- Complete placeholder screens
- Add proper error states
- Implement loading indicators

### Phase 2: Features
- Real image picking/upload
- Comments and interactions
- User follow/unfollow
- Like/save persistence

### Phase 3: Backend
- Supabase integration
- Authentication
- Real-time data sync
- Push notifications

### Phase 4: Native
- Platform-specific optimizations
- Deep linking
- Share functionality
- App store releases
