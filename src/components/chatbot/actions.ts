'use server';

import { answerQuestion } from '@/ai/flows/chatbot-answers-general-questions';
import { chatbotAnswersAdmissionQuestions } from '@/ai/flows/chatbot-answers-admission-questions';

export async function getChatbotAnswer(question: string) {
  try {
    const admissionKeywords = ['admission', 'register', 'apply', 'enroll', 'pendaftaran', 'daftar', 'syarat', 'biaya'];
    const lowerCaseQuestion = question.toLowerCase();

    // A simple "tool use" logic to decide which flow to call
    if (admissionKeywords.some(keyword => lowerCaseQuestion.includes(keyword))) {
      const response = await chatbotAnswersAdmissionQuestions({ question });
      return response.answer;
    } else {
      const response = await answerQuestion({ question });
      return response.answer;
    }
  } catch (error) {
    console.error("Error getting chatbot answer:", error);
    return "Maaf, saya sedang mengalami kesulitan untuk terhubung. Silakan coba lagi nanti.";
  }
}
