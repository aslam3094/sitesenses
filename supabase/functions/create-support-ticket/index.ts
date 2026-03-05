import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_email, issue } = await req.json();

    // Validate input
    if (!user_email || !issue) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and issue are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert support ticket into database
    const { data: ticket, error: dbError } = await supabase
      .from('support_tickets')
      .insert([
        {
          user_email,
          issue,
          status: 'open',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create support ticket' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notification email to admin (aslam3094@gmail.com)
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SiteSense Support <support@sitesense.io>',
        to: 'aslam3094@gmail.com',
        subject: 'New Support Ticket Received',
        html: `
          <h2>New Support Ticket</h2>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>From:</strong> ${user_email}</p>
          <p><strong>Issue:</strong></p>
          <p>${issue.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      console.error('Failed to send admin email:', await adminEmailResponse.text());
    }

    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SiteSense Support <support@sitesense.io>',
        to: user_email,
        subject: 'Thank you for your feedback',
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Hi there,</p>
          <p>We have received your support request and our team will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${issue.replace(/\n/g, '<br>')}</p>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p>If you have any additional information to share, simply reply to this email.</p>
          <br>
          <p>Best regards,<br>The SiteSense Team</p>
        `,
      }),
    });

    if (!userEmailResponse.ok) {
      console.error('Failed to send user email:', await userEmailResponse.text());
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Support ticket created successfully',
        ticket_id: ticket.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Support ticket error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
