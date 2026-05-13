import { Link } from 'expo-router';
import { LayoutGrid, PlusSquare, Sparkles, X } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function CreateScreen() {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const surfaceSubtleColor = useThemeColor({}, 'surfaceSubtle');
  const borderStrongColor = useThemeColor({}, 'borderStrong');

  return (
    <View style={styles.overlay}>
      <View style={[styles.sheet, { backgroundColor: surfaceColor }]}>
        <View style={[styles.handle, { backgroundColor: borderStrongColor }]} />
        <View style={styles.sheetHeader}>
          <Text style={[styles.title, { color: textColor }]}>Create</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: surfaceMutedColor }]}>
              <X size={20} color={secondaryTextColor} />
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Quick actions for creating boards, posts, or inspiration.</Text>

        <View style={styles.contentContainer}>
          <Link href="/board/new" asChild>
            <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]}>
              <View style={[styles.iconContainer, styles.boardIcon, { backgroundColor: surfaceMutedColor }]}>
                <LayoutGrid size={20} color={textColor} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: textColor }]}>Add Board</Text>
                <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Create a collection for a trip or city</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/post/select-board" asChild>
            <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]}>
              <View style={[styles.iconContainer, styles.postIcon, { backgroundColor: surfaceMutedColor }]}>
                <PlusSquare size={20} color={textColor} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: textColor }]}>Add Post</Text>
                <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Document a new place you visited</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/inspo/new" asChild>
            <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]}>
              <View style={[styles.iconContainer, styles.inspoIcon, { backgroundColor: surfaceMutedColor }]}>
                <Sparkles size={20} color={textColor} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: textColor }]}>Get Inspo</Text>
                <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Browse ideas and save inspiration</Text>
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
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
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
  },
  postIcon: {
  },
  inspoIcon: {
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
  },
});
