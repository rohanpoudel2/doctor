class LlmService
  def initialize
    @client = OpenAI::Client.new(
      uri_base: 'http://localhost:11434'
    )
  end

  def evaluate_and_rewrite(patient_background, conversation)
    prompt = <<~PROMPT
      You are a professional medical evaluator. Your task is to evaluate how effective the doctors questions are in extracting relevant, complete, and clear information from the patient based on the patient background.

      Perform the following tasks:
      1. Evaluate all of the doctors questions for their relevance, completeness, and clarity in relation to the patient background and the patients responses.
      2. Rewrite the patients primary concern in a neutral, third-person tone.

      Patient Background:
      #{patient_background}

      Conversation:
      #{format_conversation(conversation)}

      Provide the response in the following JSON format only and nothing else and no comments:
      {
        "interaction_scores": [
          {
            "question": "<doctor_question>",
            "response": "<patient_response>",
            "scores": {
              "relevance": <score>,
              "completeness": <score>,
              "clarity": <score>
            },
            "feedback": "<feedback about how effective the question was in extracting relevant information>"
          },
          ...
        ],
        "rewritten_concern": "<rewritten_primary_concern>"
      }
    PROMPT

    response = @client.chat(
      parameters: {
        model: 'llama3',
        messages: [
          { role: 'system', content: 'You are an expert medical evaluator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }
    )

    raise 'No valid response from LLM' unless response['choices'] && response['choices'].any?

    content = response['choices'][0]['message']['content']

    json_fragment = extract_json_fragment(content)
    Rails.logger.debug "Extracted JSON fragment: #{json_fragment}"

    begin
      JSON.parse(json_fragment)
    rescue JSON::ParserError => e
      Rails.logger.error "Failed to parse JSON: #{e.message}"
      raise 'Extracted JSON fragment is invalid'
    end
  end

  private

  def extract_json_fragment(response)
    match = response.match(/\{(?:[^{}]|(?:\g<0>))*\}/m)
    raise 'No JSON fragment found in response' unless match

      match[0].strip
  end

  def format_conversation(conversation)
    conversation.map do |entry|
      timestamp = entry['timestamp']
      interaction = entry['interaction'].map { |i| "#{i['speaker']}: #{i['message']}" }.join(' | ')
      "#{timestamp}: #{interaction}"
    end.join("\n")
  end
end
