function getCurrentDateAndTime() {
    const now = new Date();
  
    const dateStr = new Intl.DateTimeFormat('en-US', {
      month: 'long',     // January
      day: 'numeric',    // 9
      year: 'numeric'    // 2025
    }).format(now);
  
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true // now: Date PM
    }).format(now);
  
    console.log("Getting current date and time:", dateStr, timeStr);
    return `The current date is ${dateStr}, and the time is ${timeStr}.`;
  }
  
  module.exports = {
    getCurrentDateAndTime
  };
  