import fs from 'fs';
import pdf from 'pdf-parse';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY; 
const client = axios.create({
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
});

export async function readPdf(pdfBuffer) {
    let data = await pdf(pdfBuffer);
    return data.text;
}

export async function processTextWithGPT4(pdf1Text, pdf2Text) {
    const params = {
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "system",
                content: "You are a highly skilled AI tasked with processing the text from two PDF files."
            },
            {
                role: "user",
                content: `Please analyze the text and return the extracted information in JSON format. The extracted information needs to be variables that are enclosed in {} flower braces and give me the pure JSON output of those variables from both PDFs. Fill in the values of those variables from another PDF I have given to you. Make sure you get all the variables or as much as you can. Do not add any additional text of your own. Here are some things you need to remember for formatting the values: Date needs to be in this form - 23rd September, 2023 and not in 23/09/2023. I dont want / in my date so I want my Date to be like this - 23rd September, 2023. Please make sure you return the date only in this form. Please remove rawxml as a key in the json output. Please fill in the Day and the month and year form the Date itself. Day would be like this - 23rd or 4th or 27th and then the month and year would be - September, 2023. Please fill in the details accordingly. If there is a long address, split the address into twi address of the same person and use a comma as an escape sequence to determine the split. There are many scenarios where there are several other plaintiffs, defendants, addresses, dates, etc. Please make sure you handle all of them and name them appropriately. Please make sure you return the output in JSON format. PDF1 content: ${pdf1Text}\nPDF2 content: ${pdf2Text}`
            }
        ]
    };
    try {
        const response = await client.post('https://api.openai.com/v1/chat/completions', params);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error in API response:", error);
        return null;
    }
}
