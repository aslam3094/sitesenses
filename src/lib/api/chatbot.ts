import { supabase } from '@/integrations/supabase/client';

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  widget_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatbotWithStats extends Chatbot {
  total_messages: number;
  total_tokens: number;
  sources_count: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anySupabase = supabase as any;

export const chatbotApi = {
  // Fetch all chatbots for current user
  async fetchChatbots(): Promise<ChatbotWithStats[]> {
    const { data, error } = await anySupabase
      .from('chatbots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const chatbots = (data || []) as Chatbot[];
    
    const chatbotsWithStats = await Promise.all(chatbots.map(async (chatbot) => {
      const [messagesResult, sourcesResult, statsResult] = await Promise.all([
        anySupabase.from('chatbot_messages').select('id', { count: 'exact', head: true }).eq('chatbot_id', chatbot.id),
        anySupabase.from('chatbot_sources').select('id', { count: 'exact', head: true }).eq('chatbot_id', chatbot.id),
        anySupabase.from('chatbot_messages').select('token_count').eq('chatbot_id', chatbot.id),
      ]);
      
      return {
        ...chatbot,
        total_messages: messagesResult.count || 0,
        sources_count: sourcesResult.count || 0,
        total_tokens: (statsResult.data || []).reduce((sum: number, msg: { token_count?: number }) => sum + (msg.token_count || 0), 0),
      };
    }));
    
    return chatbotsWithStats;
  },

  // Fetch single chatbot
  async fetchChatbot(id: string): Promise<Chatbot> {
    const { data, error } = await anySupabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Chatbot;
  },

  // Create new chatbot
  async createChatbot(name: string, description?: string): Promise<Chatbot> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await anySupabase
      .from('chatbots')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      if (error.message?.includes('Maximum of 3 chatbots')) {
        throw new Error('Maximum of 3 chatbots allowed per account');
      }
      throw error;
    }
    return data as Chatbot;
  },

  // Update chatbot
  async updateChatbot(id: string, updates: Partial<Chatbot>): Promise<Chatbot> {
    const { data, error } = await anySupabase
      .from('chatbots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Chatbot;
  },

  // Delete chatbot
  async deleteChatbot(id: string): Promise<void> {
    const { error } = await anySupabase
      .from('chatbots')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get chatbot sources
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchChatbotSources(chatbotId: string): Promise<any[]> {
    const { data, error } = await anySupabase
      .from('chatbot_sources')
      .select('*')
      .eq('chatbot_id', chatbotId);

    if (error) throw error;
    return data || [];
  },

  // Add source to chatbot
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addSourceToChatbot(chatbotId: string, sourceId: string): Promise<any> {
    const { data, error } = await anySupabase
      .from('chatbot_sources')
      .insert({
        chatbot_id: chatbotId,
        source_id: sourceId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove source from chatbot
  async removeSourceFromChatbot(chatbotId: string, sourceId: string): Promise<void> {
    const { error } = await anySupabase
      .from('chatbot_sources')
      .delete()
      .eq('chatbot_id', chatbotId)
      .eq('source_id', sourceId);

    if (error) throw error;
  },

  // Fetch chatbot chat history
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchChatHistory(chatbotId: string): Promise<any[]> {
    const { data, error } = await anySupabase
      .from('chatbot_messages')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Save chat message
  async saveMessage(
    chatbotId: string,
    role: 'user' | 'assistant',
    content: string,
    tokenCount: number = 0
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await anySupabase
      .from('chatbot_messages')
      .insert({
        chatbot_id: chatbotId,
        user_id: user.id,
        role,
        content,
        token_count: tokenCount,
      });

    if (error) throw error;
  },

  // Clear chatbot chat history
  async clearChatHistory(chatbotId: string): Promise<void> {
    const { error } = await anySupabase
      .from('chatbot_messages')
      .delete()
      .eq('chatbot_id', chatbotId);

    if (error) throw error;
  },

  // Get embed code for chatbot
  getEmbedCode(chatbotId: string): string {
    const baseUrl = window.location.origin;
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/widget.js';
    script.async = true;
    script.setAttribute('data-chatbot-id', '${chatbotId}');
    document.head.appendChild(script);
  })();
</script>
<div id="sitesense-widget-container"></div>`;
  },
};
