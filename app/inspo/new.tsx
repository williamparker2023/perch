import { router } from 'expo-router';
import { ArrowLeft, ImagePlus, Lock, MapPin, Sparkles, Unlock } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function NewInspoScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceStrongColor = useThemeColor({}, 'surfaceStrong');
  const [isPrivate, setIsPrivate] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [location, setLocation] = useState('');

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Sparkles size={18} color={textColor} />
            <Text style={[styles.headerTitle, { color: textColor }]}>New Inspo Board</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: surfaceStrongColor }]}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload}>
          <ImagePlus size={22} color={secondaryTextColor} />
          <View style={styles.imageUploadText}>
            <Text style={[styles.imageUploadTitle, { color: textColor }]}>Add Cover Photo</Text>
            <Text style={[styles.imageUploadSubtext, { color: secondaryTextColor }]}>Optional banner image</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formField}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Name of inspo board (e.g., Dream Tokyo Trip)"
            placeholderTextColor={secondaryTextColor}
            value={boardName}
            onChangeText={setBoardName}
          />
        </View>

        <View style={[styles.formField, styles.borderBottom]}>
          <MapPin size={20} color={secondaryTextColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="City, Region, or Country"
            placeholderTextColor={secondaryTextColor}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.privacyContainer}>
          <View>
            <Text style={[styles.privacyLabel, { color: textColor }]}>{!isPrivate ? 'Public' : 'Private'}</Text>
            <Text style={[styles.privacySubtext, { color: secondaryTextColor }]}>
              {!isPrivate ? 'Anyone can see this board' : 'Only you can see this board'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, isPrivate && styles.toggleActive, isPrivate && { backgroundColor: surfaceStrongColor }]}
            onPress={() => setIsPrivate((value) => !value)}>
            {!isPrivate ? <Unlock size={12} color={secondaryTextColor} /> : <Lock size={12} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  imageUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
    marginBottom: 16,
  },
  imageUploadText: {
    flex: 1,
  },
  imageUploadTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  imageUploadSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
    paddingTop: 16,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  privacySubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
  },
});
