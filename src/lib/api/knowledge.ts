import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeSource {
  id: string;
  user_id: string;
  source_type: 'url' | 'document';
  name: string;
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  processing_stage: 'pending' | 'scraping' | 'embedding' | 'completed' | 'error';
  extracted_text: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const knowledgeApi = {
  // Fetch all knowledge sources for current user
  async fetchSources(): Promise<KnowledgeSource[]> {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as KnowledgeSource[];
  },

  // Add a URL source and trigger scraping
  async addUrl(url: string): Promise<KnowledgeSource> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create the source record
    const { data: source, error: insertError } = await supabase
      .from('knowledge_sources')
      .insert({
        user_id: user.id,
        source_type: 'url',
        name: url,
        url: url,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Trigger scraping in background
    supabase.functions.invoke('scrape-url', {
      body: { url, sourceId: source.id }
    }).catch(err => {
      console.error('Scraping error:', err);
    });

    return source as KnowledgeSource;
  },

  // Upload document and trigger processing
  async uploadDocument(file: File): Promise<KnowledgeSource> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upload file to storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Create the source record
    const { data: source, error: insertError } = await supabase
      .from('knowledge_sources')
      .insert({
        user_id: user.id,
        source_type: 'document',
        name: file.name,
        file_path: filePath,
        file_name: file.name,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Trigger document processing in background
    supabase.functions.invoke('process-document', {
      body: { sourceId: source.id, filePath }
    }).catch(err => {
      console.error('Document processing error:', err);
    });

    return source as KnowledgeSource;
  },

  // Delete a knowledge source
  async deleteSource(id: string, filePath?: string | null): Promise<void> {
    // Delete file from storage if it exists
    if (filePath) {
      await supabase.storage.from('documents').remove([filePath]);
    }

    // Embeddings are deleted automatically via CASCADE

    // Delete the source record
    const { error } = await supabase
      .from('knowledge_sources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get embedding count for a source
  async getEmbeddingCount(sourceId: string): Promise<number> {
    const { count, error } = await supabase
      .from('embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('source_id', sourceId);

    if (error) throw error;
    return count || 0;
  },

  // Subscribe to realtime updates
  subscribeToUpdates(callback: (source: KnowledgeSource) => void) {
    return supabase
      .channel('knowledge-sources-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'knowledge_sources'
        },
        (payload) => {
          callback(payload.new as KnowledgeSource);
        }
      )
      .subscribe();
  }
};
