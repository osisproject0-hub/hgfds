'use server';
/**
 * @fileOverview An AI agent that creates content based on a user's prompt.
 *
 * - createContent - A function that handles the content creation process.
 */

import { ai } from '@/ai/genkit';
import {
  CreateContentInputSchema,
  CreateContentOutputSchema,
  type CreateContentInput,
  type CreateContentOutput,
} from '@/ai/schemas/content-creation';

export async function createContent(
  input: CreateContentInput
): Promise<CreateContentOutput> {
  return createContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createContentPrompt',
  input: { schema: CreateContentInputSchema },
  output: { schema: CreateContentOutputSchema },
  prompt: `You are an AI assistant for a vocational school in Indonesia. Your task is to generate content for the school's website based on a user's prompt.

The user will provide a prompt, and you must generate a structured content object. For now, you should always assume the content type is a 'newsArticle'.

Generate the content in Bahasa Indonesia.

Based on the prompt, create a title, the main content, a relevant category, and find a suitable placeholder image URL from picsum.photos (e.g., https://picsum.photos/seed/your-seed/800/600).

User Prompt: {{{prompt}}}`,
});

const createContentFlow = ai.defineFlow(
  {
    name: 'createContentFlow',
    inputSchema: CreateContentInputSchema,
    outputSchema: CreateContentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
