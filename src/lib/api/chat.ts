import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ChatbotMessage {
  id: string;
  chatbot_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const chatApi = {
  // Fetch chat history for current user (global)
  async fetchHistory(): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return (data || []) as ChatMessage[];
  },

  // Fetch chat history for a specific chatbot
  async fetchChatbotHistory(chatbotId: string): Promise<ChatbotMessage[]> {
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return (data || []) as ChatbotMessage[];
  },

  // Save a message to global history
  async saveMessage(role: 'user' | 'assistant', content: string, metadata: Record<string, unknown> = {}): Promise<ChatMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        role,
        content,
        metadata
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as ChatMessage;
  },

  // Save a message to chatbot-specific history
  async saveChatbotMessage(chatbotId: string, role: 'user' | 'assistant', content: string, metadata: Record<string, unknown> = {}): Promise<ChatbotMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('chatbot_messages')
      .insert({
        chatbot_id: chatbotId,
        user_id: user.id,
        role,
        content,
        metadata
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as ChatbotMessage;
  },

  // Clear global chat history
  async clearHistory(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Clear chatbot-specific chat history
  async clearChatbotHistory(chatbotId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chatbot_messages')
      .delete()
      .eq('chatbot_id', chatbotId)
      .eq('user_id', user.id);

    if (error) throw error;
  }
};
