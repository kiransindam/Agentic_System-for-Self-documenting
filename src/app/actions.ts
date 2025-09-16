'use server';

import { generateInitialDocumentation } from '@/ai/flows/generate-initial-documentation';
import { suggestDocumentationImprovements } from '@/ai/flows/suggest-documentation-improvements';

export async function generateDocsAction(code: string): Promise<{ documentation: string } | { error: string }> {
  if (!code) {
    return { error: 'Code input is empty.' };
  }
  try {
    const result = await generateInitialDocumentation({ code });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate documentation. Please check the server logs.' };
  }
}

export async function improveDocsAction(code: string, existingDocumentation: string): Promise<{ suggestedImprovements: string } | { error: string }> {
  if (!code || !existingDocumentation) {
    return { error: 'Code or existing documentation is empty.' };
  }
  try {
    const result = await suggestDocumentationImprovements({ code, existingDocumentation });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to improve documentation. Please check the server logs.' };
  }
}
