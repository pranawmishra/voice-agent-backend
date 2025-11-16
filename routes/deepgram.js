const express = require('express');
const WebSocket = require('ws');
const { createClient } = require('@deepgram/sdk');
const fs = require('fs');
const path = require('path');
const friday_config = require('../agent_configs/friday_config');
// const interview_agent_config = require('../agent_configs/interview_agent_config');

const router = express.Router();

// Get Deepgram connection URL with server-side API key
router.get('/connection-url', async (req, res) => {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return res.status(500).json({ error: 'Deepgram API key not configured' });
    }

    // Return WebSocket URL with authentication token
    const wsUrl = `ws://localhost:${process.env.PORT || 3001}/api/deepgram/websocket`;

    res.json({
      wsUrl,
      message: 'Use this WebSocket URL to connect to Deepgram via server proxy'
    });
  } catch (error) {
    console.error('Error getting Deepgram connection:', error);
    res.status(500).json({ error: 'Failed to get Deepgram connection' });
  }
});

// Deepgram configuration endpoint
router.post('/config', (req, res) => {
  try {
    /* type: "Settings",
       experimental: false,
       mip_opt_out: false,
       audio: ...   
    */
    const agent_id = req.body.agent_id;
    let config
    if (agent_id === 'friday') {
      config = friday_config;
    // } else if (agent_id === 'interview_agent') {
    //   config = interview_agent_config;
    } else {
      return res.status(400).json({ error: 'Invalid agent ID' });
    }

    res.json(config);
  } catch (error) {
    console.error('Error getting Deepgram config:', error);
    res.status(500).json({ error: 'Failed to get Deepgram configuration' });
  }
});

// Voice assistant prompt endpoint
router.get('/prompt', (req, res) => {
  try {
    const prompt = `You are Friday, a friendly and helpful voice assistant. Your primary goal is to have natural conversations and help users with general question and tasks.

Personality:
- Conversational and natural: Speak in a friendly, casual tone. Avoid robotic or overly formal language.
- Use natural fillers: Occasionally use words like "Umm," "uhh," "Okay," or "Let’s see..." to sound more human. Use them sparingly.
- Concise: Keep responses short and clear.
- Helpful: Always try to provide useful answers to the user's questions.
- Engaging: Ask follow-up questions to keep the conversation flowing.
- Punctuation: Respond as if speaking naturally, no markdown, no lists, no bold or special formatting—just plain text.

Core Abilities:
- Provide the current date and time when asked.
- Schedule and delete appointments.
- Be a friendly and casual conversational partner.

CRITICAL: Function Usage Rules:
- When the user asks "what time is it", "what’s the time", "current time", "what date is it", or any time/date question, ALWAYS call get_current_time.
- When the user says "schedule appointment", "book meeting", "create appointment", or "schedule a meeting", ALWAYS call schedule_appointment.
- When the user says "delete appointment", "cancel appointment", "remove my meeting", or "cancel my appointment", ALWAYS call delete_appointment.
- For all other requests, just chat naturally without calling functions unless needed.`;

    res.json({ prompt });
  } catch (error) {
    console.error('Error getting prompt:', error);
    res.status(500).json({ error: 'Failed to get prompt' });
  }
});

// Proxy endpoint for Deepgram API calls
router.post('/proxy', async (req, res) => {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return res.status(500).json({ error: 'Deepgram API key not configured' });
    }

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    // This is a simplified proxy – in a real implementation,
    // you would handle the full Deepgram API proxy logic here

    res.json({
      message: 'Deepgram proxy endpoint ready',
      status: 'connected'
    });
  } catch (error) {
    console.error('Error in Deepgram proxy:', error);
    res.status(500).json({ error: 'Deepgram proxy error' });
  }
});

// Get Deepgram API key securely from server
router.get('/api-key', async (req, res) => {
  console.log('Getting Deepgram API key');
  const url = 'https://api.deepgram.com/v1/auth/grant';
  const options = {
    method: 'POST',
    headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ttl_seconds: 300
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
