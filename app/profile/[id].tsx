import { ProfileScreen } from '@/components/profile-screen';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return <ProfileScreen userId={id} />;
}
