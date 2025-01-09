"use client";
import { useState, useRef, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import logger from '../logger';

const counselorLogger = logger.child('counselor');

export default function AICounselor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI counselor. I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const suggestedTopics = [
    { id: 1, name: 'Anxiety', icon: 'mdi:brain' },
    { id: 2, name: 'Depression', icon: 'mdi:heart-broken' },
    { id: 3, name: 'Stress', icon: 'mdi:lightning-bolt' },
    { id: 4, name: 'Sleep', icon: 'mdi:sleep' },
    { id: 5, name: 'Relationships', icon: 'mdi:account-group' },
    { id: 6, name: 'Work-Life Balance', icon: 'mdi:briefcase' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = async (userMessage) => {
    setIsTyping(true);
    counselorLogger.info({ message: userMessage }, 'User sent message to AI counselor');

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponses = [
      "I understand how you're feeling. Can you tell me more about that?",
      "That sounds challenging. How long have you been experiencing this?",
      "Thank you for sharing that with me. What do you think triggered these feelings?",
      "I'm here to support you. Have you tried any coping strategies that helped in the past?",
      "Your feelings are valid. Let's explore this together. What would you like to focus on?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date()
    }]);
    
    setIsTyping(false);
    counselorLogger.info({ response: randomResponse }, 'AI counselor responded');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    await simulateResponse(inputMessage);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    const message = `I'd like to talk about ${topic.name}.`;
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);
    simulateResponse(message);
  };

  if (!user) {
    return <div className="p-6">Please log in to access the AI Counselor</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r p-4 hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Topics</h2>
        <div className="space-y-2">
          {suggestedTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                selectedTopic?.id === topic.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon icon={topic.icon} width="24" height="24" />
              {topic.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">About AI Counselor</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Confidential and judgment-free support</p>
            <p>• Available 24/7</p>
            <p>• Uses advanced AI to understand and help</p>
            <p>• Not a replacement for professional help</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:robot" width="24" height="24" className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold">AI Counselor</h2>
              <p className="text-sm text-gray-500">Here to support you 24/7</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex gap-2">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="mdi:send" width="20" height="20" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 