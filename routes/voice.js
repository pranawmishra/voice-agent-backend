const express = require('express');
const { getCurrentDateAndTime } = require('../utils/functionUtils');

const router = express.Router();

// Basic function call handler for voice assistant
router.post('/function-calls', (req, res) => {
  try {
    const { functions } = req.body;

    if (!functions || !Array.isArray(functions)) {
      return res.status(400).json({ error: 'Invalid functions array' });
    }

    const responses = [];

    for (const functionCall of functions) {
      const { id, name, arguments: argsStr } = functionCall;

      try {
        const args = JSON.parse(argsStr);
        let responseContent = '';

        switch (name) {
          case 'schedule_appointment':
            responseContent = schedule_appointment(args);
            // console.log(`Successfully scheduled appointment titled '${args.title}' for ${args.time}.`);
            break;

          case 'delete_appointment':
            console.log('Deleting appointment:', args.title);
            responseContent = `Successfully deleted appointment titled '${args.title}'.`;
            break;

          case 'get_current_date_and_time':
            responseContent = getCurrentDateAndTime();
            break;

          default:
            console.error(`Unknown function: ${name}`);
            responseContent = `I'm not sure how to handle that request. Is there something else I can help you with?`;
            break;
        }

        responses.push({
          type: "FunctionCallResponse",
          id,
          name,
          content: responseContent
        });

      } catch (parseError) {
        console.error('Error parsing function arguments:', parseError);
        responses.push({
          type: "FunctionCallResponse",
          id,
          name,
          content: 'Sorry, I had trouble understanding that request.'
        });
      }
    }

    res.json( responses );
  } catch (error) {
    console.error('Error handling function calls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function schedule_appointment(args) {
  console.log('Scheduling appointment:', args.title, 'at', args.time);
  return `Successfully scheduled appointment titled '${args.title}' for ${args.time}.`;
}

module.exports = router;
