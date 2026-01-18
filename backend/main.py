from fastapi import FastAPI, Body, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from GetFeedback import get_ai_feedback, get_ai_score
from supabase import create_client, Client
import uvicorn
from elevenlabs import ElevenLabs
import time

# Config
SUPABASE_URL = "https://hqhctbfficltygvyxrom.supabase.co"
SUPABASE_KEY = "sb_publishable_laYwqN89CouhXoLPStHoVQ_4KDdHPGO" 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    token = authorization.split(" ")[1] if " " in authorization else authorization
    try:
        res = supabase.auth.get_user(token)
        return res.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")

@app.post("/login")
async def login(email: str = Body(...), password: str = Body(...)):
    try:
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return {"access_token": response.session.access_token, "user_id": response.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@app.post("/signup")
async def signup(email: str = Body(...), password: str = Body(...)):
    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        return {"message": "Success", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/chat")
async def handle_chat(
    conversation_id: str = Body(...),
    job_description: str = Body(...),
    interview_type: str = Body(...),
    company_name: str = Body(...),
    job_title: str = Body(...),
    current_user: any = Depends(get_current_user)   
):
    user_id = current_user.id

    # 1. ElevenLabs Transcript
    try:
        client = ElevenLabs(base_url="https://api.elevenlabs.io",api_key ="sk_c99a06ed40aafbc9d931ccccbb6c8460406204900f7e3aaa")
        chat_data = client.conversational_ai.conversations.get(conversation_id=conversation_id)
        while chat_data.status != "done" and chat_data.status != "failed" :
            # print(chat_data)
            time.sleep(1)   
            #print("Waiting for conversation to complete...", flush=True)
            chat_data = client.conversational_ai.conversations.get(conversation_id=conversation_id)

        chat_history_list = chat_data.transcript 
        
    except Exception as e:
        print(f"ElevenLabs Error: {e}",flush=True)
        raise HTTPException(status_code=500, detail="Failed to fetch transcript")

    # 2. Format History
    full_history_string = "\n".join([f"{t.role.capitalize()}: {t.message}" for t in chat_history_list])
    #print(full_history_string,flush=True)
    # 3. Get AI Feedback
    feedback_text = get_ai_feedback(job_description, interview_type, chat_history_list)
    
    # make function call to get score, uses gemini api given job_description, interview_type, chat_history_list, returns score in range[0:100]
    feedback_score = -1
    try:
        feedback_score = get_ai_score(interview_feedback=feedback_text)
        feedback_score = int(feedback_score)
        feedback_score = feedback_score if 0 <= feedback_score <= 100 else -1
    except Exception as e:
        feedback_score = -1
        print(f"Score Error: {e}", flush=True)

    #print(f"Feedback Score: {feedback_score}", flush=True)
    #print(feedback_text,flush=True)



    # 4. Save to DB
    try:
        resp = supabase.table("interviews").insert({
            "user_id": user_id,
            "job_description": job_description,
            "type": interview_type,
            "chat_history": full_history_string,
            "feedback": feedback_text,
            "company_name": company_name,
            "job_title": job_title,
            "score": feedback_score
        }).execute()
        
        resp = resp.data[0]
        resp.pop("user_id", None)
        print(f"DB Insert Response: {resp}", flush=True)
    except Exception as e:
        print(f"DB Error: {e}",flush = True)

    return resp

@app.get("/past-interviews")
async def get_past_interviews(current_user: any = Depends(get_current_user)):
    user_id = current_user.id
    try:
        resp = supabase.table("interviews").select(
                "id",
                "job_description", 
                "type", 
                "feedback", 
                "created_at", 
                "company_name", 
                "job_title",
                "user_id",
                "chat_history",
                "score"
            ).eq('user_id', user_id).execute()

        resp = resp.data
        #print(resp)
        for r in resp:
            r.pop("user_id", None)

        return resp

    except Exception as e:
        print(f"DB Error: {e}",flush = True)
        raise HTTPException(status_code=500, detail=str(e))




@app.post("/logout")
async def logout(current_user: any = Depends(get_current_user)):
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 

        
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080, log_level="debug")