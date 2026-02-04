import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const chatApi = {
  // Fetch chat history for current user
  async fetchHistory(): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return (data || []) as ChatMessage[];
  },

  // Save a message to history
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

  // Clear chat history
  async clearHistory(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  }
};
