import { router } from 'expo-router';
import { ArrowLeft, ImagePlus, Lock, MapPin, Unlock } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewBoardScreen() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [location, setLocation] = useState("");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Board</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload}>
          <ImagePlus size={22} color="#999" />
          <View style={styles.imageUploadText}>
            <Text style={styles.imageUploadTitle}>Add Banner Photo</Text>
            <Text style={styles.imageUploadSubtext}>Optional cover image</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formField}>
          <TextInput
            style={styles.input}
            placeholder="Name of board (e.g., Summer in Paris)"
            value={boardName}
            onChangeText={setBoardName}
          />
        </View>

        <View style={[styles.formField, styles.borderBottom]}>
          <MapPin size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="City or Region"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.privacyContainer}>
          <View>
            <Text style={styles.privacyLabel}>
              {!isPrivate ? "Public" : "Private"}
            </Text>
            <Text style={styles.privacySubtext}>
              {!isPrivate ? "Anyone can see this board" : "Only you can see this board"}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggle, isPrivate && styles.toggleActive]}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            {!isPrivate ? (
              <Unlock size={12} color="#666" />
            ) : (
              <Lock size={12} color="#fff" />
            )}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  createButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createText: {
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
    paddingBottom: 12,
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
