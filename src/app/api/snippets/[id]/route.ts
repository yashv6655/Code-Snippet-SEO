import { NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth();
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    const supabase = await createClient();
    const userId = (authResult.user as User).id;
    const resolvedParams = await params;
    const snippetId = resolvedParams.id;

    // First check if the snippet exists and belongs to the user
    const { data: snippet, error: fetchError } = await supabase
      .from('snippets')
      .select('id, user_id')
      .eq('id', snippetId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !snippet) {
      return Response.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Delete the snippet
    const { error: deleteError } = await supabase
      .from('snippets')
      .delete()
      .eq('id', snippetId)
      .eq('user_id', userId);

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}