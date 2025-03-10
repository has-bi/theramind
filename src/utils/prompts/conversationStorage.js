// Key for storing message in Local Storage
const STORAGE_KEY = "mindly_chat_history";

// Function to save a message to Local Storage
export function saveMessage(message) {
  try {
    const messages = getMessages();

    messages.push(message);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    return true;
  } catch (error) {
    console.log("Error saving message to Local Storage:", error);
    return false;
  }
}

export function saveDialogue(userMessage, botResponse) {
  saveMessage({ role: "user", content: userMessage });
  saveMessage({ role: "assistant", content: botResponse });
}

// Get all stored messages
export function getMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.log("Error getting messages:", error);
    return [];
  }
}

// Function to clear messages history
export function clearMessages() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasEnoughMessagesRecap() {
  const messages = getMessages();
  return messages.length >= 2;
}
