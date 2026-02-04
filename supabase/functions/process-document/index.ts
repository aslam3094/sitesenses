import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sourceId, filePath } = await req.json();

    if (!sourceId || !filePath) {
      return new Response(
        JSON.stringify({ success: false, error: 'sourceId and filePath are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing document:', filePath, 'for user:', user.id);

    // Update status to processing
    await supabase
      .from('knowledge_sources')
      .update({ status: 'processing' })
      .eq('id', sourceId)
      .eq('user_id', user.id);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      await supabase
        .from('knowledge_sources')
        .update({ 
          status: 'error',
          error_message: `Failed to download file: ${downloadError.message}`
        })
        .eq('id', sourceId)
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({ success: false, error: `Failed to download file: ${downloadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine file type and extract text
    const fileName = filePath.split('/').pop() || '';
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    let extractedText = '';

    try {
      if (fileExt === 'txt' || fileExt === 'md') {
        // Plain text files - read directly
        extractedText = await fileData.text();
      } else if (fileExt === 'pdf') {
        // For PDF, we'll extract basic text
        // Note: Full PDF parsing would require a PDF library
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Simple text extraction - look for text streams in PDF
        const textDecoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = textDecoder.decode(uint8Array);
        
        // Extract text between stream markers (basic PDF text extraction)
        const streamMatches = rawText.match(/stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g) || [];
        const textParts: string[] = [];
        
        for (const stream of streamMatches) {
          // Try to find readable text in streams
          const cleanedStream = stream
            .replace(/stream[\r\n]+/, '')
            .replace(/[\r\n]+endstream/, '')
            .replace(/[^\x20-\x7E\r\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanedStream.length > 20) {
            textParts.push(cleanedStream);
          }
        }
        
        // Also try to find text in parentheses (PDF text objects)
        const textObjects = rawText.match(/\(([^)]+)\)/g) || [];
        for (const textObj of textObjects) {
          const cleaned = textObj.slice(1, -1).trim();
          if (cleaned.length > 3 && /[a-zA-Z]/.test(cleaned)) {
            textParts.push(cleaned);
          }
        }
        
        extractedText = textParts.join('\n\n');
        
        if (!extractedText || extractedText.length < 50) {
          extractedText = `[PDF file: ${fileName}]\n\nNote: This PDF may contain scanned images or complex formatting. Basic text extraction was performed. For better results, consider using a plain text or markdown version of this document.`;
        }
      } else {
        throw new Error(`Unsupported file type: ${fileExt}`);
      }

      console.log('Document processed, extracted', extractedText.length, 'characters');

      // Update source with extracted content
      await supabase
        .from('knowledge_sources')
        .update({ 
          status: 'completed',
          extracted_text: extractedText,
          metadata: { 
            fileName,
            fileType: fileExt,
            charCount: extractedText.length 
          },
          error_message: null
        })
        .eq('id', sourceId)
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            charCount: extractedText.length,
            preview: extractedText.substring(0, 500)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      const errorMsg = extractError instanceof Error ? extractError.message : 'Failed to extract text';
      
      await supabase
        .from('knowledge_sources')
        .update({ 
          status: 'error',
          error_message: errorMsg
        })
        .eq('id', sourceId)
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process document';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
