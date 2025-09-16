'use server';

/**
 * @fileOverview Suggests improvements to existing documentation by identifying unclear, incomplete, or outdated areas.
 *
 * - suggestDocumentationImprovements - A function that suggests improvements to the documentation.
 * - SuggestDocumentationImprovementsInput - The input type for the suggestDocumentationImprovements function.
 * - SuggestDocumentationImprovementsOutput - The return type for the suggestDocumentationImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDocumentationImprovementsInputSchema = z.object({
  code: z.string().describe('The code for which documentation improvements are suggested.'),
  existingDocumentation: z.string().describe('The existing documentation for the code.'),
});

export type SuggestDocumentationImprovementsInput = z.infer<
  typeof SuggestDocumentationImprovementsInputSchema
>;

const SuggestDocumentationImprovementsOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe(
      'Suggestions for improving the existing documentation, identifying unclear, incomplete, or outdated areas.'
    ),
});

export type SuggestDocumentationImprovementsOutput = z.infer<
  typeof SuggestDocumentationImprovementsOutputSchema
>;

export async function suggestDocumentationImprovements(
  input: SuggestDocumentationImprovementsInput
): Promise<SuggestDocumentationImprovementsOutput> {
  return suggestDocumentationImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDocumentationImprovementsPrompt',
  input: {schema: SuggestDocumentationImprovementsInputSchema},
  output: {schema: SuggestDocumentationImprovementsOutputSchema},
  prompt: `You are an AI expert in documenting code.

You are provided with existing documentation and the code it documents.

Your job is to suggest improvements to the documentation, pointing out areas that are unclear, incomplete, or outdated.

Code:
{{code}}

Existing Documentation:
{{existingDocumentation}}`,
});

const suggestDocumentationImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestDocumentationImprovementsFlow',
    inputSchema: SuggestDocumentationImprovementsInputSchema,
    outputSchema: SuggestDocumentationImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
