from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<API KEY>", )

def get_ai_feedback(job_description, type_of_interview, chat_history_list):
    """
    Formats the dialogue and requests feedback from the AI.
    """
    
    # Format the list of strings into a readable transcript for the AI
    formatted_transcript = "\n".join([f"Speaker: {msg}" for msg in chat_history_list])

    # 1. System Instruction
    system_instruction = (
        f"You are an expert career coach analyzing an interview transcript.\n"
        f"Job Description: {job_description}\n"
        f"Interview Type: {type_of_interview}\n"
        "Give bullets point reviewing the interview:"
        "3 bullets point for strengths if there are any, and 3 bullets point for areas of improvement if there are any. DO NOT ADD ANYTHING ELSE.\n"
        "Use the following format:\n"
        "Strengths:\n"
        "- Strength 1\n"
        "- Strength 2\n"    
        "- Strength 3\n"
        "Areas for Improvement:\n"
        "- Improvement 1\n"
        "- Improvement 2\n"    
        "- Improvement 3\n"
    )

    # 2. Messages for the API
    messages = [
        {"role": "system", "content": system_instruction},
        {"role": "user", "content": f"Interview Transcript:\n{formatted_transcript}"}
    ]

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=messages
        )
        
        feedback = response.choices[0].message.content
        return feedback

    except Exception as e:
        return f"Error generating feedback: {str(e)}"

def get_ai_score(interview_feedback):
    system_instruction = (
        f"You are an expert career coach analyzing an interview transcript.\n"
        f"Feedback for the interview: {interview_feedback}\n"
        "Based on the feedback, provide a score from 0 to 100 for the interview performance, where 0 is poor and 100 is excellent. Just provide the number without any additional text."
    )

    # 2. Messages for the API
    messages = [
        {"role": "system", "content": system_instruction},
    ]

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=messages
        )
        
        feedback = response.choices[0].message.content
        return feedback

    except Exception as e:
        return f"Error generating feedback: {str(e)}"

    