export function throwIfSupabaseError(scope: string, error: { message: string } | null) {
  if (!error) {
    return;
  }

  throw new Error(`[${scope}] ${error.message}`);
}
