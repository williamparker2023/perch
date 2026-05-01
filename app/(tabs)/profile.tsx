import { collections, currentUser, places } from '@/constants/data';
import { Edit3, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [tab, setTab] = useState<"boards" | "posts">("boards");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileUser = currentUser;
  const isOwnProfile = true;

  const userCollections = collections.filter(c =>
    c.userId === profileUser.id
  );

  const userPosts = places.filter(p => p.userId === profileUser.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{profileUser.handle}</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <Settings size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: profileUser.banner }} style={styles.banner} />
        
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.followers}</Text>
            <Text style={styles.statLabel}>flock</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.following}</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profileUser.name}</Text>
        {profileUser.bio && (
          <Text style={styles.bio}>{profileUser.bio}</Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, tab === "boards" && styles.tabButtonActive]}
          onPress={() => setTab("boards")}
        >
          <Text style={[styles.tabButtonText, tab === "boards" && styles.tabButtonTextActive]}>
            Boards
          </Text>
          {tab === "boards" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, tab === "posts" && styles.tabButtonActive]}
          onPress={() => setTab("posts")}
        >
          <Text style={[styles.tabButtonText, tab === "posts" && styles.tabButtonTextActive]}>
            Posts
          </Text>
          {tab === "posts" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      <View style={styles.contentGrid}>
        {tab === "boards" 
          ? userCollections.map((collection) => (
              <View key={collection.id} style={styles.gridItem}>
                <Image source={{ uri: collection.coverImage }} style={styles.gridImage} />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridTitle}>{collection.title}</Text>
                </View>
              </View>
            ))
          : userPosts.map((post) => (
              <View key={post.id} style={styles.gridItem}>
                <Image source={{ uri: post.image }} style={styles.gridImage} />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridTitle}>{post.name}</Text>
                </View>
              </View>
            ))
        }
      </View>

      {isMenuOpen && (
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Edit3 size={20} color="#000" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Settings size={20} color="#000" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'flex-end',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {},
  tabButtonText: {
    fontSize: 14,
    color: '#999',
  },
  tabButtonTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 15,
    color: '#000',
  },
});
