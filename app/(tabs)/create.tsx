import { Link } from 'expo-router';
import { LayoutGrid, PlusSquare, Sparkles, X } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateScreen() {
  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.title}>Create</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.closeButton}>
              <X size={20} color="#333" />
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.subtitle}>Quick actions for creating boards, posts, or inspiration.</Text>

        <View style={styles.contentContainer}>
          <Link href="/board/new" asChild>
            <TouchableOpacity style={styles.createOption}>
              <View style={[styles.iconContainer, styles.boardIcon]}>
                <LayoutGrid size={20} color="#111827" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Add Board</Text>
                <Text style={styles.optionDescription}>Create a collection for a trip or city</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/post/new" asChild>
            <TouchableOpacity style={styles.createOption}>
              <View style={[styles.iconContainer, styles.postIcon]}>
                <PlusSquare size={20} color="#111827" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Add Post</Text>
                <Text style={styles.optionDescription}>Document a new place you visited</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/inspo/new" asChild>
            <TouchableOpacity style={styles.createOption}>
              <View style={[styles.iconContainer, styles.inspoIcon]}>
                <Sparkles size={20} color="#111827" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Get Inspo</Text>
                <Text style={styles.optionDescription}>Browse ideas and save inspiration</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  contentContainer: {
    gap: 14,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardIcon: {
    backgroundColor: '#e2e8f0',
  },
  postIcon: {
    backgroundColor: '#e2e8f0',
  },
  inspoIcon: {
    backgroundColor: '#e2e8f0',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
});
