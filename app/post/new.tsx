import { router } from 'expo-router';
import { ArrowLeft, FileText, ImagePlus, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ["Do Local", "Fitness", "Food", "Lodging", "Museum", "Shops", "Sights", "Other"];
const PRICES = ["Free/NA", "$", "$$", "$$$"];

export default function NewPostScreen() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("Free/NA");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.publishText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive
            ]}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload}>
          <ImagePlus size={24} color="#999" />
          <Text style={styles.imageUploadText}>Add Photo or Video</Text>
          <Text style={styles.imageUploadSubtext}>Up to 5 photos</Text>
        </TouchableOpacity>

        <View style={styles.formField}>
          <MapPin size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Place name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formField}>
          <FileText size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.formField}>
          <FileText size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll}>
            {PRICES.map(price => (
              <TouchableOpacity
                key={price}
                onPress={() => setSelectedPrice(price)}
                style={[
                  styles.priceButton,
                  selectedPrice === price && styles.priceButtonActive
                ]}
              >
                <Text style={[
                  styles.priceText,
                  selectedPrice === price && styles.priceTextActive
                ]}>
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rating</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Text style={styles.star}>
                  {star <= rating ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  publishButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryText: {
    fontSize: 13,
    color: '#999',
  },
  categoryTextActive: {
    color: '#fff',
  },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  imageUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: '#999',
    position: 'absolute',
    left: 44,
    top: 28,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    padding: 0,
  },
  priceContainer: {
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  priceScroll: {
    flexDirection: 'row',
  },
  priceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  priceButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  priceText: {
    fontSize: 13,
    color: '#999',
  },
  priceTextActive: {
    color: '#fff',
  },
  ratingContainer: {
    gap: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 24,
  },
});
