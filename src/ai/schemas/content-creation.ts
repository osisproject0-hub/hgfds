
import { z } from 'zod';
import { newsCategories } from '@/app/admin/content/news/NewsArticleForm';

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

