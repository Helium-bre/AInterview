async function sendFinishedInterview(job_company, job_title, job_description, interview_type, user_id, conversation_id) {
    const resp = await fetch(`${env.URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            company_name: job_company,
            job_title: job_title,
            job_description: job_description,
            interview_type: interview_type,
            user_id: user_id,
            conversation_id: conversation_id,

        }),
    })

    return resp.json();
}
