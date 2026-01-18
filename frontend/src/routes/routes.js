// Helper to get headers with Auth
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

async function sendFinishedInterview(job_company, job_title, job_description, interview_type, conversation_id) {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            company_name: job_company,
            job_title: job_title,
            job_description: job_description,
            interview_type: interview_type,
            conversation_id: conversation_id,
            // user_id removed from body; Backend gets it from the token
        }),
    });
    return resp.json();
}

async function fetchInterviews() {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/past-interviews`, {
        method: "GET",
        headers: getHeaders(),
    });
    console.log("INTERVIEWS FETCHED")
    //console.log(resp.json)
    return resp.json();
}

async function signup(email, password) {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
    });
    return resp.json();
}

async function login(email, password) {
    console.log("LOGIN")
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password:password }),
    });
    return resp.json();
}

async function logout() {
    console.log("LOGOUT")
    localStorage.removeItem("token");
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: getHeaders(),
    });
    return resp.json();
} 

export { sendFinishedInterview, fetchInterviews, signup, login, logout };