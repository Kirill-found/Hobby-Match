import apiClient from './client';

export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ConversationPreview {
  match_id: number;
  partner_id: number;
  partner_name: string;
  partner_photo: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  is_last_message_from_me: boolean;
}

export interface SendMessageRequest {
  match_id: number;
  receiver_id: number;
  text: string;
}

export const chatApi = {
  // Get all conversations
  getConversations: async (): Promise<ConversationPreview[]> => {
    const response = await apiClient.get<ConversationPreview[]>('/chat/conversations');
    return response.data;
  },

  // Get messages in a conversation
  getMessages: async (matchId: number): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/chat/conversations/${matchId}/messages`);
    return response.data;
  },

  // Send a message
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>('/chat/messages', data);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: number): Promise<void> => {
    await apiClient.put(`/chat/messages/${messageId}/read`);
  },
};
