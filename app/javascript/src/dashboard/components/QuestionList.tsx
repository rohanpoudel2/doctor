import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  score: number;
  feedback: string;
  relevance: "high" | "medium" | "low";
}

interface QuestionListProps {
  questions: Question[];
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Question Analysis
    </h3>
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="border-b border-gray-100 pb-4 last:border-0"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-800 font-medium mb-1">{question.text}</p>
              <p className="text-sm text-gray-600">{question.feedback}</p>
              <div className="mt-2 flex items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    question.relevance === "high"
                      ? "bg-green-100 text-green-800"
                      : question.relevance === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {question.relevance.charAt(0).toUpperCase() +
                    question.relevance.slice(1)}{" "}
                  Relevance
                </span>
              </div>
            </div>
            <div className="ml-4 flex items-center">
              {question.score >= 70 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="ml-2 font-semibold">{question.score}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
