/**
 * Example: Integrating ImagePlaceholder with AI Services
 * Shows how to use image placeholders with real AI responses
 */
import React, { useState } from 'react';
import { mentalHealthAI } from '../services/MentalHealthAI.js';
import { ImagePlaceholder } from '../components/ImagePlaceholder.jsx';
import MobileChatBubble from '../components/MobileChatBubble.jsx';

export function ImagePlaceholderIntegration() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello! I\'m here to support you. How are you feeling today?',
      timestamp: new Date(),
      hasImage: true,
      imageUrl: null // Will show placeholder
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date(),
      hasImage: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response (this will use the real AI service if configured)
      const aiResponse = await mentalHealthAI.generateResponse(
        inputText,
        messages.slice(-5) // Include recent conversation history
      );

      // Create AI message with image placeholder
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: aiResponse,
        timestamp: new Date(),
        hasImage: true,
        imageUrl: null, // Future: could be generated image URL
        // Future properties for real image generation:
        // imagePrompt: generateImagePrompt(aiResponse),
        // imageStyle: 'supportive', 'calming', 'motivational'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback message with placeholder
      const fallbackMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I\'m having trouble connecting right now, but I\'m still here for you. How can I support you today?',
        timestamp: new Date(),
        hasImage: true,
        imageUrl: null
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  const chatContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxHeight: '500px',
    overflowY: 'auto'
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E1E8ED',
    fontSize: '16px',
    fontFamily: 'Quicksand, sans-serif',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#6B73FF',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: '600'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>
        AI Chat with Image Placeholders
      </h1>

      <div style={chatContainerStyle}>
        {messages.map(message => (
          <MobileChatBubble
            key={message.id}
            message={message.text}
            isUser={message.role === 'user'}
            hasImage={message.hasImage}
            imageUrl={message.imageUrl}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '10px',
            color: '#666'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#6B73FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white'
            }}>
              🤖
            </div>
            <div>AI is thinking...</div>
          </div>
        )}
      </div>

      <div style={inputContainerStyle}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Share how you're feeling..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          style={buttonStyle}
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          Send
        </button>
      </div>

      {/* Future Image Generation Integration Example */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: 'white', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#2C3E50' }}>
          Future Image Generation Integration
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          When real image generation is added, the flow will be:
        </p>
        <ol style={{ fontSize: '12px', color: '#888', paddingLeft: '20px' }}>
          <li>AI generates supportive text response</li>
          <li>System generates image prompt based on response sentiment</li>
          <li>Image generation API creates supportive visual</li>
          <li>ImagePlaceholder component displays the generated image</li>
          <li>Fallback to placeholder if image generation fails</li>
        </ol>
        
        <div style={{ marginTop: '15px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#2C3E50' }}>
            Example Generated Image Scenarios:
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <ImagePlaceholder width={80} height={60} />
            <div style={{ fontSize: '11px', color: '#666', flex: 1, minWidth: '200px' }}>
              <strong>Calming Scene:</strong> When user expresses anxiety, generate peaceful nature scenes, soft colors, breathing exercises visualization
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
            <ImagePlaceholder width={80} height={60} />
            <div style={{ fontSize: '11px', color: '#666', flex: 1, minWidth: '200px' }}>
              <strong>Motivational Visual:</strong> When user shares achievements, generate uplifting imagery, progress symbols, celebration themes
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
            <ImagePlaceholder width={80} height={60} />
            <div style={{ fontSize: '11px', color: '#666', flex: 1, minWidth: '200px' }}>
              <strong>Supportive Reminder:</strong> When user needs encouragement, generate gentle affirmations, growth metaphors, warm colors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagePlaceholderIntegration;