import { NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { Snippet } from "@/types/snippet";

// Simple validation function to replace Zod
function validateSnippetData(body: any) {
  const errors: string[] = [];
  
  if (!body.code || typeof body.code !== 'string' || body.code.trim().length === 0) {
    errors.push('Code is required');
  }
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
    errors.push('Description is required');
  }
  if (!body.explanation || typeof body.explanation !== 'string' || body.explanation.trim().length === 0) {
    errors.push('Explanation is required');
  }
  if (!body.html_output || typeof body.html_output !== 'string' || body.html_output.trim().length === 0) {
    errors.push('HTML output is required');
  }
  if (!body.schema_markup || typeof body.schema_markup !== 'object') {
    errors.push('Schema markup is required');
  }
  
  return {
    success: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      code: body.code,
      language: body.language || null,
      title: body.title,
      description: body.description,
      explanation: body.explanation,
      html_output: body.html_output,
      schema_markup: body.schema_markup,
    } : null
  };
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireApiAuth();
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    const supabase = await createClient();
    const userId = (authResult.user as any).id;

    const { data: snippets, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ snippets });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/snippets called');
  try {
    console.log('Checking authentication...');
    const authResult = await requireApiAuth();
    console.log('Auth result:', authResult);
    
    if ('error' in authResult) {
      console.log('Authentication failed:', authResult.error);
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    console.log('Parsing request body...');
    const body = await req.json().catch(() => ({}));
    console.log('Request body:', body);
    
    const validation = validateSnippetData(body);
    console.log('Validation result:', validation);
    
    if (!validation.success) {
      console.log('Validation failed:', validation.errors);
      return Response.json({ 
        error: "Invalid request data", 
        details: validation.errors 
      }, { status: 400 });
    }

    const supabase = await createClient();
    const userId = (authResult.user as any).id;

    console.log('Attempting to insert snippet for user:', userId);
    console.log('Data to insert:', { user_id: userId, ...validation.data });

    const { data: snippet, error } = await supabase
      .from('snippets')
      .insert([{
        user_id: userId,
        ...validation.data,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json({ 
        error: error.message, 
        details: error,
        hint: error.hint || 'No additional hint'
      }, { status: 500 });
    }

    console.log('Successfully created snippet:', snippet);
    return Response.json({ snippet }, { status: 201 });
  } catch (err: unknown) {
    console.error('Unexpected error in POST /api/snippets:', err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Unexpected error", details: message, stack: err instanceof Error ? err.stack : undefined }, { status: 500 });
  }
}