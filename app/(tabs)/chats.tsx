
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { t } from '@/utils/i18n';
import { supabase } from '@/lib/supabase';
import { Chat } from '@/types/establishment';

export default function ChatsScreen() {
  const theme = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('chats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          loadChats(); // Reload chats when new messages arrive
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          establishments (
            id,
            name,
            image_url
          ),
          employees (
            id,
            name,
            photo_url,
            role
          )
        `)
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.log('Error loading chats:', error);
        return;
      }

      // Get the last message for each chat
      const chatsWithMessages = await Promise.all(
        (data || []).map(async (chat) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...chat,
            last_message: lastMessage,
          };
        })
      );

      setChats(chatsWithMessages);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: '/chat-detail',
      params: {
        chatId: chat.id,
        establishmentName: chat.establishments?.name || 'Unknown',
        employeeName: chat.employees?.name || 'Unknown',
      },
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.avatarContainer}>
        {item.employees?.photo_url ? (
          <Image source={{ uri: item.employees.photo_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.background }]}>
            <IconSymbol name="person.fill" size={24} color={theme.colors.text + '60'} />
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.establishmentName, { color: theme.colors.text }]}>
            {item.establishments?.name}
          </Text>
          {item.last_message && (
            <Text style={[styles.timestamp, { color: theme.colors.text + '60' }]}>
              {formatTime(item.last_message.created_at)}
            </Text>
          )}
        </View>
        
        <Text style={[styles.employeeName, { color: theme.colors.text + '80' }]}>
          {item.employees?.name} • {item.employees?.role}
        </Text>
        
        {item.last_message && (
          <Text
            style={[styles.lastMessage, { color: theme.colors.text + '60' }]}
            numberOfLines={1}
          >
            {item.last_message.content}
          </Text>
        )}
      </View>
      
      <View style={styles.chatActions}>
        <IconSymbol name="chevron.right" size={16} color={theme.colors.text + '40'} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Chats',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />

      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="message.fill" size={64} color={theme.colors.text + '40'} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Chats Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.text + '80' }]}>
            Start a conversation with an establishment to see your chats here
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  chatsList: {
    padding: 16,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  employeeName: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
  },
  chatActions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
