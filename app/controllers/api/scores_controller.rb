class Api::ScoresController < ApplicationController
  def create
    conversation = params[:conversation]
    patient_background = params[:patient_background]

    llm_service = LlmService.new
    result = llm_service.evaluate_and_rewrite(patient_background, conversation)

    session_metadata = {
      date: Time.current.strftime('%B %d, %Y - %I:%M %p'),
      duration: calculate_duration(conversation),
      recommendations: generate_recommendations(result['interaction_scores'].map { |s| s['scores'] }),
      total_scores: calculate_total_scores(result['interaction_scores'])
    }

    render json: result.merge(session_metadata:)
  end

  private

  def clamp_score(score)
    return 0 if score.nil?

    [[score, 0].max, 100].min
  end

  def calculate_duration(conversation)
    timestamps = conversation.map { |entry| Time.parse(entry['timestamp']) }
    start_time = timestamps.min
    end_time = timestamps.max

    duration = end_time - start_time

    duration_in_minutes_int = (duration / 60).to_i

    "#{duration_in_minutes_int} minutes"
  end

  def generate_recommendations(scores)
    average_scores = calculate_total_scores(scores)
    recommendations = []
    recommendations << 'Focus on question clarity' if average_scores[:clarity] < 7
    recommendations << 'Improve relevance to patient background' if average_scores[:relevance] < 7
    recommendations << 'Ensure comprehensive coverage of patient details' if average_scores[:completeness] < 7
    recommendations.any? ? recommendations : ['Well done! No major issues identified.']
  end

  def calculate_total_scores(interaction_scores)
    totals = { relevance: 0, completeness: 0, clarity: 0 }

    interaction_scores.each do |score_entry|
      scores = score_entry['scores']
      if scores.nil? || !scores.is_a?(Hash)
        Rails.logger.warn "Invalid scores format: #{scores.inspect}"
        next
      end

      totals[:relevance] += clamp_score(scores['relevance'])
      totals[:completeness] += clamp_score(scores['completeness'])
      totals[:clarity] += clamp_score(scores['clarity'])
    end

    count = interaction_scores.size
    Rails.logger.debug "Totals Before Average: #{totals}, Count: #{count}"

    return { relevance: 0, completeness: 0, clarity: 0 } if count.zero?

    totals.transform_values { |v| (v / count.to_f).round(2) }
  end
end
