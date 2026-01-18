import { startRecording, stopRecording, playAudio } from '../../audiotest/test.js';
import { useConversation } from '@elevenlabs/react';


export default function AudioTest() {

    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected');
        },

        onDisconnect: () => {
            console.log('Disconnected');
        },

        onStatusChange: () => {
            console.log('status changed');
            console.log(conversation.status);
        }
    });
    
    async function startConversation() {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const conversationId = await conversation.startSession({
            agentId: 'agent_6101kf6wh22wek3tmx2e7w7w8yd7',
            //userId: '<your-end-user-id>', // optional field
        });

            console.log(conversation.isSpeaking); // boolean

    }

    async function endConversation() {
        await conversation.endSession();
    }

    return (
        /*<div>
            <h1>Audio Test</h1>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <button onClick={playAudio}>Play Audio</button>
        </div>*/

        <div>
            <button onClick={startConversation}>Start Conversation</button>
            <button onClick={endConversation}>End Conversation</button>
        </div>


    );
}