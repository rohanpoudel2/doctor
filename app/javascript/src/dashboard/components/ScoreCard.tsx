import React from "react";
import { Trophy, Target, Brain } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  description: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  icon,
  description,
}) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="text-blue-600">{icon}</div>
    </div>
    <div className="flex items-baseline">
      <p className="text-3xl font-bold text-gray-900">{score}%</p>
      <p className="ml-2 text-sm text-gray-600">/ 100</p>
    </div>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </div>
);
