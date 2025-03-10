export const messageToString = ({ text, content }) => {
  if (text && !content) return text;

  const fileTypeMap = {
    image: "Изображение",
    video: "Видео",
    audio: "Музыка",
    voice: "Голосовое сообщение",
    file: "Файл",
  };

  return content?.fileType ? fileTypeMap[content.fileType] || null : null;
};
