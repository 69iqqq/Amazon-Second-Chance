import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  // Use the same api key we saw earlier, but we need to set it via environment variable or passing it.
  const ai = new GoogleGenAI({ apiKey: "<YOUR_API_KEY>" });

  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: prompt,
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }
  } catch (error) {
    console.error("Failed to generate image:", error);
  }
}

main();
