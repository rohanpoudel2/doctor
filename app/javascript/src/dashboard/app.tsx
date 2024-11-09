import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Target, Brain } from "lucide-react";
import { ScoreCard } from "./components/ScoreCard";
import { QuestionList } from "./components/QuestionList";

const CONVAI_API_KEY = "96ac5280554941966a97e03eb17ab9b0";
const CHAR_ID = "a420dc4a-9d26-11ef-abfd-42010a7be016";

function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [characterDetails, setCharacterDetails] = useState<any | null>(null);
  const [scoreData, setScoreData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<"chat" | "analysis">("chat");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://api.convai.com/character/chatHistory/list",
          { charID: CHAR_ID, limit: 100 },
          { headers: { "CONVAI-API-KEY": CONVAI_API_KEY } }
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCharacterDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://api.convai.com/character/get",
          { charID: CHAR_ID },
          { headers: { "CONVAI-API-KEY": CONVAI_API_KEY } }
        );
        setCharacterDetails(response.data);
      } catch (error) {
        console.error("Error fetching character details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    fetchCharacterDetails();
  }, []);

  const fetchChatHistory = async (sessionID: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.convai.com/character/chatHistory/details",
        { charID: CHAR_ID, sessionID },
        { headers: { "CONVAI-API-KEY": CONVAI_API_KEY } }
      );
      setChatHistory(response.data);
      setSelectedSession(sessionID);
      setViewState("chat");
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async () => {
    if (!chatHistory.length || !characterDetails) {
      console.error("Chat history or character details are missing.");
      return;
    }

    const csrfToken = document
      .getElementById("root")
      ?.getAttribute("data-csrftoken");

    if (csrfToken) axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;

    const payload = {
      conversation: chatHistory,
      patient_background: characterDetails.backstory,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/scores",
        payload
      );
      setScoreData(response.data);
      setViewState("analysis");
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRelevanceLabel = (
    score: number
  ): "high" | "medium" | "low" => {
    if (score >= 0.8) return "high";
    if (score >= 0.5) return "medium";
    return "low";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Session Analysis Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading && <p>Loading...</p>}

        {!selectedSession && !loading && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Session</h2>
            <ul className="space-y-4">
              {sessions.map((session: any) => (
                <li key={session.sessionID}>
                  <button
                    onClick={() => fetchChatHistory(session.sessionID)}
                    className="text-blue-600 hover:underline"
                  >
                    {session.date} - {session.time}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSession && !loading && characterDetails && (
          <div>
            <button
              onClick={() => setSelectedSession(null)}
              className="text-blue-600 hover:underline mb-4 block"
            >
              Back to Session List
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <h3 className="text-xl font-semibold mb-4">Chat History</h3>
              <ul className="space-y-4">
                {chatHistory.map((entry: any, index: number) => (
                  <li key={index} className="border-b border-gray-100 pb-4">
                    <p className="text-gray-800">
                      <strong>{entry.timestamp}</strong>
                    </p>
                    {entry.interaction.map((message: any, idx: number) => (
                      <p key={idx} className="text-gray-600">
                        <strong>{message.speaker}:</strong> {message.message}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </div>

            {viewState === "chat" && (
              <button
                onClick={fetchScores}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Analyze
              </button>
            )}

            {viewState === "analysis" && scoreData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Session Summary
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Patient
                        </h4>
                        <p className="text-gray-800">
                          {characterDetails.character_name}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Date & Time
                        </h4>
                        <p className="text-gray-800">
                          {scoreData.session_metadata.date}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Duration
                        </h4>
                        <p className="text-gray-800">
                          {scoreData.session_metadata.duration}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Primary Concern
                        </h4>
                        <p className="text-gray-800">
                          {scoreData.session_metadata.primary_concern}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                          Key Recommendations
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {scoreData.session_metadata.recommendations.map(
                            (rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <QuestionList
                    questions={scoreData?.interaction_scores.map(
                      (q: any, idx: number) => ({
                        id: idx + 1,
                        text: q.question || "No question provided",
                        score: Math.round(q.scores.relevance * 100),
                        feedback: q.feedback || "No feedback available",
                        relevance: calculateRelevanceLabel(q.scores?.relevance),
                      })
                    )}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
