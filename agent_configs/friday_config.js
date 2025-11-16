const config = {
    type: "Settings",
    experimental: false,
    mip_opt_out: false,
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: 16000
      },
      output: {
        encoding: "linear16",
        sample_rate: 24000,
        container: "none"
      }
    },
    agent: {
      language: "en",
      listen: {
        provider: {
          type: "deepgram",
          model: "nova-3"
        }
      },
      think: {
        provider: {
          type: "groq",
          model: "openai/gpt-oss-20b"
        },
        prompt: `You are Friday, a friendly and helpful voice assistant. Your primary goal is to have natural conversations and help users with general questions and tasks.
  
  Personality:
  - Conversational and natural: Speak in a friendly, casual tone. Avoid robotic or overly formal language.
  - Use natural fillers: Occasionally use words like "Umm," "uhh," "Okay," or "Let's see..." to sound more human. Use them sparingly.
  - Concise: Keep responses short and clear.
  - Helpful: Always try to provide useful answers to the user's questions.
  - Engaging: Ask follow-up questions to keep the conversation flowing.
  - Punctuation: Respond as if speaking naturally, no markdown, no lists, no bold or special formatting—just plain text.
  
  Core Abilities:
  - Provide the current date and time when asked.
  - Schedule and delete appointments.
  - Be a friendly and casual conversational partner.
  
  CRITICAL: Function Usage Rules:
  - When the user asks "what time is it", "what's the time", "current time", "what date is it", or any time/date question, ALWAYS call get_current_date_and_time.
  - When the user says "schedule appointment", "book meeting", "create appointment", or "schedule a meeting", ALWAYS call schedule_appointment.
  - When the user says "delete appointment", "cancel appointment", "remove my meeting", or "cancel my appointment", ALWAYS call delete_appointment.
  - For all other requests, just chat naturally without calling functions unless needed.`,
        functions: [
          {
            name: "schedule_appointment",
            description: "Schedule a new appointment for the user",
            parameters: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title or description of the appointment"
                },
                time: {
                  type: "string",
                  description: "The date and time for the appointment"
                }
              },
              required: ["title", "time"]
            }
          },
          {
            name: "delete_appointment",
            description: "Delete an existing appointment by title",
            parameters: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title of the appointment to delete"
                }
              },
              required: ["title"]
            }
          },
          {
            name: "get_current_date_and_time",
            description: "Get the current date and time and provide it to the user",
            parameters: {
              type: "object",
              properties: {},
              required: []
            }
          }
        ]
      },
      speak: {
        provider: {
          type: "deepgram",
          model: "aura-2-thalia-en"
        },
        greeting: "Hello! I'm Friday, your friendly voice assistant. How can I help you today?"
      }
    }
  };
  
  module.exports = config;
  