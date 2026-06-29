export function getReadingTime(content: string): string {
  if (!content) return '1 min read';
  
  // Clean HTML tags and markdown symbols
  const cleanContent = content
    .replace(/<\/?[^>]+(>|$)/g, '') // remove HTML tags
    .replace(/[#*`_\[\]()]/g, ''); // remove basic markdown symbols
    
  // Match English words and Chinese characters
  const words = cleanContent.match(/[\w-]+/g) || [];
  const chineseChars = cleanContent.match(/[\u4e00-\u9fa5]/g) || [];
  
  const wordCount = words.length + chineseChars.length;
  const time = Math.ceil(wordCount / 200); // average speed: 200 words/min
  
  return `${time} min read`;
}
