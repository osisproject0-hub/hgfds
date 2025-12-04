'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/chatbot-answers-general-questions.ts';
import '@/ai/flows/chatbot-answers-admission-questions.ts';
import '@/ai/flows/create-content-flow.ts';
