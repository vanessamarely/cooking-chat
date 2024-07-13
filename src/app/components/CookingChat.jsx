"use client";

import Head from "next/head";
import React, { useState } from "react";

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import Loading from "./Loading";

// safety settings for the model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// generation config for the model
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const MODEL_NAME = "gemini-1.5-flash";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function CookingChat() {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ parts: "", role: "" }]);
  const [message, setMessage] = useState(
    " You are an expert AI cooking model, I want to prepare a dish, for example a pizza, can you help me with the recipe?"
  );

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig,
    safetySettings,
  });

  const chat = model.startChat({
    history: [],
  });

  const addMessageToHistory = (role, message) => {
    setChatHistory((prev) => [...prev, { parts: message, role }]);
  };

  const fetchData = async () => {
    setLoading(true);
    addMessageToHistory("user", message);
    const result = await chat.sendMessage(message);
    const response = result.response
      .text()
      .replace(/\*\*/g, "<b>")
      .replace(/\*/g, "<li>")
      .replace(/\_/g, "<i>")
      .replace(/\n/g, "<br>");
    addMessageToHistory("model", response);
    setMessage("");
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleSetMessage = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Cooking Chat</title>
      </Head>
      <div className="bg-gray-100">
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Chat</h2>

              {loading && <Loading />}
              <div className="border-t-2 border-gray-200 mt-2 pt-2">
                {chatHistory.map(({ parts, role }, index) => (
                  <div className="flex items-start mb-4 text-sm" key={index}>
                    {parts.length > 0 ? (
                      <div className="flex-1 ml-3 pt-1">
                        <p className="text-gray-600">
                          {role === "user" ? (
                            <span>User</span>
                          ) : (
                            <span>Model:</span>
                          )}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: parts }} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="I am AI model, expert cooking assistant. Ask me anything about cooking!"
                  value={message}
                  onChange={handleSetMessage}
                ></textarea>
                <button
                  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
