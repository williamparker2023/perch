import { Circle, Plus, X } from 'lucide-react-native';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type InspoBoardOption = {
  id: string;
  title: string;
  coverImage: string;
};

type InspoSaveModalProps = {
  visible: boolean;
  boards: InspoBoardOption[];
  selectedBoardId: string | null;
  onClose: () => void;
  onCreateNew: () => void;
  onSelectBoard: (boardId: string) => void;
};

export function InspoSaveModal({
  visible,
  boards,
  selectedBoardId,
  onClose,
  onCreateNew,
  onSelectBoard,
}: InspoSaveModalProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const surfaceSubtleColor = useThemeColor({}, 'surfaceSubtle');
  const borderColor = useThemeColor({}, 'border');
  const borderStrongColor = useThemeColor({}, 'borderStrong');

  return (
    <Modal animationType="fade" visible={visible} transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, { backgroundColor: surfaceColor, borderColor }]} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>Save to Inspo</Text>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: surfaceMutedColor }]} onPress={onClose}>
              <X size={20} color={secondaryTextColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.optionCard, { backgroundColor: surfaceSubtleColor, borderColor }]}
              onPress={onCreateNew}>
              <View style={[styles.leadingIcon, { backgroundColor: surfaceMutedColor }]}>
                <Plus size={22} color={textColor} />
              </View>
              <View style={styles.optionBody}>
                <Text style={[styles.optionTitle, { color: textColor }]}>Create new inspo</Text>
              </View>
            </TouchableOpacity>

            {boards.map((board) => {
              const isSelected = selectedBoardId === board.id;

              return (
                <TouchableOpacity
                  key={board.id}
                  style={[styles.optionCard, { backgroundColor: surfaceSubtleColor, borderColor }]}
                  onPress={() => onSelectBoard(board.id)}>
                  <Image source={{ uri: board.coverImage }} style={styles.coverImage} />
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionTitle, { color: textColor }]}>{board.title}</Text>
                    <Text style={[styles.optionSubtitle, { color: secondaryTextColor }]}>Custom Board</Text>
                  </View>
                  <View style={[styles.radioOuter, { borderColor: isSelected ? textColor : borderStrongColor }]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: textColor }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 14,
  },
  optionCard: {
    minHeight: 86,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leadingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
