import { initBotId } from 'botid/client/core';

// Initialize BotID to protect form submission endpoints from bots
// These paths must match the API routes where checkBotId() is called
initBotId({
  protect: [
    { path: '/api/contact', method: 'POST' },
    { path: '/api/newsletter', method: 'POST' },
  ],
});
