class LlmService
  def initialize
    @client = OpenAI::Client.new(
      uri_base: 'http://localhost:11434'
    )
  end

  def evaluate_interaction(doctor_question, patient_message, patient_background)
    prompt = <<~PROMPT
      You are a medical evaluator. Your task is to score the relevance, completeness, and clarity of the following doctor's question and the patient's response based on the given patient background.

      Patient Background:
      #{patient_background}

      Doctor's Question:
      #{doctor_question}

      Patient's Response:
      #{patient_message}

      Scoring:
      - Relevance: How relevant is the doctor's question to the patient's background? (1-10)
      - Completeness: Does the question cover critical aspects of the patient's background? (1-10)
      - Clarity: Is the doctor's question clear and easy for the patient to understand? (1-10)

      Provide your scores as a JSON object:
      {
        "relevance": <score>,
        "completeness": <score>,
        "clarity": <score>
      }
    PROMPT

    response = @client.chat(
      parameters: {
        model: 'llama3',
        messages: [
          { role: 'system', content: 'You are an expert evaluator for medical conversations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      }
    )

    raise 'No valid response from LLM' unless response['choices'] && response['choices'].any?

    content = response['choices'][0]['message']['content']

    begin
      json_scores = content.match(/\{.*?\}/m)[0]
      JSON.parse(json_scores)
    rescue JSON::ParserError
      raise 'Invalid response format from LLM'
    end
  end
end
