'use server';

/**
 * @fileOverview A flow for generating initial documentation for a given code input.
 *
 * - generateInitialDocumentation - A function that takes code as input and returns a generated documentation draft.
 * - GenerateInitialDocumentationInput - The input type for the generateInitialDocumentation function.
 * - GenerateInitialDocumentationOutput - The return type for the generateInitialDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialDocumentationInputSchema = z.object({
  code: z.string().describe('The code to generate documentation for.'),
});
export type GenerateInitialDocumentationInput = z.infer<
  typeof GenerateInitialDocumentationInputSchema
>;

const GenerateInitialDocumentationOutputSchema = z.object({
  documentation: z.string().describe('The generated documentation for the code.'),
});
export type GenerateInitialDocumentationOutput = z.infer<
  typeof GenerateInitialDocumentationOutputSchema
>;

export async function generateInitialDocumentation(
  input: GenerateInitialDocumentationInput
): Promise<GenerateInitialDocumentationOutput> {
  return generateInitialDocumentationFlow(input);
}

const initialDocumentationPrompt = ai.definePrompt({
  name: 'initialDocumentationPrompt',
  input: {schema: GenerateInitialDocumentationInputSchema},
  output: {schema: GenerateInitialDocumentationOutputSchema},
  prompt: `You are an AI documentation generator. Generate documentation for the following code:\n\n{{code}}`,
});

const generateInitialDocumentationFlow = ai.defineFlow(
  {
    name: 'generateInitialDocumentationFlow',
    inputSchema: GenerateInitialDocumentationInputSchema,
    outputSchema: GenerateInitialDocumentationOutputSchema,
  },
  async input => {
    const {output} = await initialDocumentationPrompt(input);
    return output!;
  }
);
