import ConversationModel from "../models/conversation";

// TODO: create group conversation
export default async function createGroupConversation(req, res) {
  try {

  } catch (error) {
    console.log("server error while creating group conversation");
    res.status(500).json({
      error: error.message,
    });
  }
}