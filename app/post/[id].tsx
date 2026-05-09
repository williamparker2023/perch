import { collections, currentUser, inspoBoards, inspoPlaces, places, postDetailStreamPlaces, users } from '@/constants/data';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

const MOCK_COMMENTS = [
  { id: 'c1', user: users[1], text: 'This place is amazing! Added to my list.', time: '2h' },
  { id: 'c2', user: users[2], text: 'The food there is top notch.', time: '5h' },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const mutedTextColor = useThemeColor({}, 'mutedText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const iconColor = useThemeColor({}, 'text');

  const { initialPlace, isFromInspo } = useMemo(() => {
    const feedPlace = places.find((place) => place.id === id);
    if (feedPlace) {
      return { initialPlace: feedPlace, isFromInspo: false };
    }

    const inspoPlace = inspoPlaces.find((place) => place.id === id);
    if (inspoPlace) {
      return { initialPlace: inspoPlace, isFromInspo: true };
    }

    return {
      initialPlace: postDetailStreamPlaces.find((place) => place.id === id) ?? null,
      isFromInspo: false,
    };
  }, [id]);

  if (!initialPlace) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: secondaryTextColor }]}>Post not found.</Text>
      </View>
    );
  }

  const feedStream = [initialPlace, ...postDetailStreamPlaces.filter((place) => place.id !== initialPlace.id)];

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      {feedStream.map((place, index) => (
        <PostDetailItem
          key={`${place.id}-${index}`}
          place={place}
          isFromInspo={isFromInspo && index === 0}
          textColor={textColor}
          secondaryTextColor={secondaryTextColor}
          mutedTextColor={mutedTextColor}
          borderColor={borderColor}
          surfaceMutedColor={surfaceMutedColor}
          iconColor={iconColor}
        />
      ))}
    </ScrollView>
  );
}

function PostDetailItem({
  place,
  isFromInspo,
  textColor,
  secondaryTextColor,
  mutedTextColor,
  borderColor,
  surfaceMutedColor,
  iconColor,
}: {
  place: any;
  isFromInspo: boolean;
  textColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  borderColor: string;
  surfaceMutedColor: string;
  iconColor: string;
}) {
  const user = users.find((entry) => entry.id === place.userId) ?? currentUser;
  const collection = isFromInspo
    ? inspoBoards.find((entry) => entry.id === place.inspoBoardId)
    : collections.find((entry) => entry.id === place.collectionId);
  const isOwnPost = user.id === currentUser.id;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [comment, setComment] = useState('');

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <TouchableOpacity onPress={() => router.push(`/profile/${user.id}`)}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => router.push(`/profile/${user.id}`)}>
              <Text style={[styles.userHandle, { color: textColor }]}>{user.handle}</Text>
            </TouchableOpacity>
            {!!collection && (
              <TouchableOpacity
                onPress={() => router.push(isFromInspo ? `/inspo/${collection.id}` : `/collection/${collection.id}`)}>
                <Text style={[styles.collectionLink, { color: secondaryTextColor }]}>{collection.title}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={[styles.categoryTag, { backgroundColor: surfaceMutedColor }]}>
          <Text style={[styles.categoryTagText, { color: secondaryTextColor }]}>{place.category}</Text>
        </View>
      </View>

      <Image source={{ uri: place.image }} style={[styles.postImage, { backgroundColor: surfaceMutedColor }]} />

      <View style={styles.postBody}>
        <View style={styles.actionsRow}>
          <View style={styles.leadingActions}>
            <TouchableOpacity onPress={() => setIsLiked((liked) => !liked)}>
              <Heart size={24} color={isLiked ? '#ef4444' : iconColor} fill={isLiked ? '#ef4444' : 'none'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowComments((value) => !value)}>
              <MessageCircle size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Share2 size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
          {!isOwnPost && (
            <TouchableOpacity onPress={() => setIsSaved((saved) => !saved)}>
              <Sparkles size={24} color={iconColor} fill={isSaved ? iconColor : 'none'} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.placeName, { color: textColor }]}>{place.name}</Text>

        {!!place.notes && (
          <Text style={[styles.notes, { color: textColor }]}>
            <Text style={styles.notesHandle}>{user.handle} </Text>
            {isCaptionExpanded || place.notes.length <= 90 ? place.notes : `${place.notes.slice(0, 90)}... `}
            {!isCaptionExpanded && place.notes.length > 90 && (
              <Text style={[styles.expandText, { color: secondaryTextColor }]} onPress={() => setIsCaptionExpanded(true)}>
                more
              </Text>
            )}
          </Text>
        )}

        <TouchableOpacity onPress={() => setShowComments((value) => !value)}>
          <Text style={[styles.commentsToggle, { color: secondaryTextColor }]}>
            {showComments ? 'Hide comments' : 'View all 2 comments'}
          </Text>
        </TouchableOpacity>

        {showComments && (
          <View style={styles.commentsSection}>
            {MOCK_COMMENTS.map((mockComment) => (
              <View key={mockComment.id} style={styles.commentRow}>
                <Image source={{ uri: mockComment.user.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentBody}>
                  <Text style={[styles.commentText, { color: textColor }]}>
                  <Text style={styles.notesHandle}>{mockComment.user.handle} </Text>
                  {mockComment.text}
                </Text>
                  <Text style={[styles.commentTime, { color: secondaryTextColor }]}>{mockComment.time}</Text>
                </View>
              </View>
            ))}
            <View style={styles.addCommentRow}>
              <Image source={{ uri: currentUser.avatar }} style={styles.commentAvatar} />
              <TextInput
                style={[styles.commentInput, { color: textColor, borderBottomColor: borderColor }]}
                placeholder="Add a comment..."
                placeholderTextColor={secondaryTextColor}
                value={comment}
                onChangeText={setComment}
              />
            </View>
          </View>
        )}

        <Text style={[styles.timestamp, { color: mutedTextColor }]}>{place.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  post: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userHandle: {
    fontSize: 13,
    fontWeight: '700',
  },
  collectionLink: {
    fontSize: 11,
    marginTop: 2,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryTagText: {
    fontSize: 10,
  },
  postImage: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  postBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leadingActions: {
    flexDirection: 'row',
    gap: 16,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesHandle: {
    fontWeight: '700',
  },
  expandText: {
  },
  commentsToggle: {
    fontSize: 13,
    marginTop: 12,
  },
  commentsSection: {
    marginTop: 14,
    gap: 12,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentBody: {
    flex: 1,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentTime: {
    fontSize: 11,
    marginTop: 4,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    fontSize: 13,
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 14,
  },
});
