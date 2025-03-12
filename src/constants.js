export const USER_FIELDS = {
  username: { min: 4, max: 15 },
  password: { min: 4, max: 15 },
  name: { min: 4, max: 50 },
};

export const MESSAGE_MAX_LENGHT = 1024;

export const SWIPE_THRESHOLD = 50;
export const MAX_TRANSLATION = 70;

export const MESSAGE_READ_DELAY_MS = 1000;

export const UnauthorizedMessage = {
  error: "INVALID_TOKEN",
  message: "Токен недействителен.",
};
export const UnauthorizedStatusCode = 401;
export const TokenType = "Bearer";

export const CHATS_OFFSET = 50;
export const CHATS_LIMIT = 50;

export const MESSAGES_OFFSET = 100;
export const MESSAGES_LIMIT = 100;
