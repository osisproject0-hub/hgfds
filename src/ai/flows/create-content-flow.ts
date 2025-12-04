'use server';
/**
 * @fileOverview An AI agent that creates content based on a user's prompt.
 *
 * - createContent - A function that handles the content creation process.
 * - CreateContentInput - The input type for the createContent function.
 * - CreateContentOutput - The return type for the createContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const newsCategories = ["Berita", "Pengumuman", "Acara"] as const;

export const CreateContentInputSchema = z.object({
  prompt: z.string().describe('The user\'s prompt to create content.'),
});
export type CreateContentInput = z.infer<typeof CreateContentInputSchema>;

export const CreateContentOutputSchema = z.object({
    contentType: z.enum(['newsArticle']).describe("The type of content to be created."),
    data: z.object({
        title: z.string().describe("The title of the content."),
        content: z.string().describe("The full body/content."),
        imageUrl: z.string().url().describe("A relevant placeholder image URL from picsum.photos."),
        category: z.enum(newsCategories).describe("The most appropriate category for the content.")
    }).describe("The structured data of the created content.")
});
export type CreateContentOutput = z.infer<typeof CreateContentOutputSchema>;

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
