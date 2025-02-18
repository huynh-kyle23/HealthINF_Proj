const { GoogleGenerativeAI } = require("@google/generative-ai");
const secretKey = process.env.NEXT_PUBLIC_API_KEY;

const genAI = new GoogleGenerativeAI(secretKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const API = {
    GetChatbotResponse: async message => {
        const prompt = message;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    }
  };
  
  export default API;