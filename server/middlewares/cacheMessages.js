import { redisClient } from "../socket/server.js";

export async function getCachedConversationById(req, res, next) {
  try {
    const conversationId = req.params.conversationId;
    const cachedKey = `conversation:${conversationId}`;
    const cachedConversation = await redisClient.get(cachedKey);

    if (cachedConversation) {
      console.log("Cache hit: returning conversation from redis");
      return res.status(200).json(JSON.parse(cachedConversation));
    }

    console.log("Cache miss: fetching conversation from db");
    next(); // proceed to db lookup
  } catch (error) {
    console.log("Error while getting cached message: ", error.message);
    next();
  }
}