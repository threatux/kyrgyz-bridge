import { api } from "./client";

export type ExerciseType = "multiple_choice" | "translation";

export interface ExerciseQuestion {
  id: number;
  question: string;
  options?: string[];
  type: ExerciseType;
}

export interface GenerateExercisesResponse {
  exercise_id: string;
  questions: ExerciseQuestion[];
}

export interface ExerciseAnswer {
  question_id: number;
  answer: string;
}

export interface ExerciseDetail {
  question_id: number;
  question: string;
  your_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface CheckExercisesResponse {
  total: number;
  correct: number;
  incorrect: number;
  score_percent: number;
  recommendation: string;
  details: ExerciseDetail[];
}

export const generateExercises = async (type: ExerciseType, count: number) => {
  const res = await api.post<GenerateExercisesResponse>("/exercises/generate", { type, count });
  return res.data;
};

export const checkExercises = async (exercise_id: string, answers: ExerciseAnswer[]) => {
  const res = await api.post<CheckExercisesResponse>("/exercises/check", { exercise_id, answers });
  return res.data;
};
