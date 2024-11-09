class Api::ScoresController < ApplicationController
  def index
    conversation = params[:conversation]
    patient_background = params[:patient_background]

    scores = evaluate_conversation(conversation, patient_background)

    render json: scores
  end

  private

  def evaluate_conversation(conversation, patient_background)
    llm_service = LlmService.new
    aggregated_scores = { relevance: 0, completeness: 0, clarity: 0 }
    total_interactions = 0
    interaction_scores = []

    conversation.each do |entry|
      entry['interaction'].each do |interaction|
        next unless interaction['speaker'] == 'User'

        doctor_question = interaction['message']
        patient_response = entry['interaction'].find { |i| i['speaker'] == 'Character' }['message']

        scores = llm_service.evaluate_interaction(doctor_question, patient_response, patient_background)

        interaction_scores << {
          question: doctor_question,
          response: patient_response,
          scores:
        }

        aggregated_scores[:relevance] += scores['relevance']
        aggregated_scores[:completeness] += scores['completeness']
        aggregated_scores[:clarity] += scores['clarity']
        total_interactions += 1
      end
    end

    {
      interaction_scores:,
      total_scores: {
        relevance: (aggregated_scores[:relevance] / total_interactions.to_f).round(2),
        completeness: (aggregated_scores[:completeness] / total_interactions.to_f).round(2),
        clarity: (aggregated_scores[:clarity] / total_interactions.to_f).round(2)
      }
    }
  end
end
