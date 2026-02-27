// supabase/functions/check-email-exists/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    console.log('Checking email:', email);
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Service role key exists:', !!serviceRoleKey);
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables');
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Check auth.users table directly
    // Note: listUsers might not return all users at once
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000, // Increase if needed
    });
    
    console.log('Total users found:', users?.length || 0);
    
    if (error) {
      console.error('Admin API error:', error);
      throw error;
    }

    const lowerEmail = email.toLowerCase();
    const emailExists = users.some(user => 
      user.email?.toLowerCase() === lowerEmail
    );

    console.log('Email exists:', emailExists);

    return new Response(
      JSON.stringify({ 
        exists: emailExists,
        message: emailExists ? 'Email found' : 'Email not found'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        exists: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})