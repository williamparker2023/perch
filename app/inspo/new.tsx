import { router } from 'expo-router';
import { ArrowLeft, ImagePlus, Lock, MapPin, Sparkles, Unlock } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewInspoScreen() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [location, setLocation] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Sparkles size={18} color="#000" />
            <Text style={styles.headerTitle}>New Inspo Board</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload}>
          <ImagePlus size={22} color="#999" />
          <View style={styles.imageUploadText}>
            <Text style={styles.imageUploadTitle}>Add Cover Photo</Text>
            <Text style={styles.imageUploadSubtext}>Optional banner image</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formField}>
          <TextInput
            style={styles.input}
            placeholder="Name of inspo board (e.g., Dream Tokyo Trip)"
            value={boardName}
            onChangeText={setBoardName}
          />
        </View>

        <View style={[styles.formField, styles.borderBottom]}>
          <MapPin size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="City, Region, or Country"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.privacyContainer}>
          <View>
            <Text style={styles.privacyLabel}>{!isPrivate ? 'Public' : 'Private'}</Text>
            <Text style={styles.privacySubtext}>
              {!isPrivate ? 'Anyone can see this board' : 'Only you can see this board'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, isPrivate && styles.toggleActive]}
            onPress={() => setIsPrivate((value) => !value)}>
            {!isPrivate ? <Unlock size={12} color="#666" /> : <Lock size={12} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
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
    color: '#000',
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: '#999',
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
    color: '#000',
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
    color: '#000',
  },
  privacySubtext: {
    fontSize: 12,
    color: '#999',
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
    backgroundColor: '#000',
  },
});
