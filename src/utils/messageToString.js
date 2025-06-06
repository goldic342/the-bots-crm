export const messageToString = message => {
  const text = message?.text;
  const content = message?.content;

  if (text && !content) return text;

  const fileTypeMap = {
    image: "Изображение",
    video: "Видео",
    audio: "Музыка",
    voice: "Голосовое сообщение",
    file: "Файл",
  };

  return content?.type ? fileTypeMap[content?.type] || null : null;
};
