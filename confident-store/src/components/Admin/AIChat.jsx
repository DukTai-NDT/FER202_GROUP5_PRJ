import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, Card, Spinner } from 'react-bootstrap';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
// Import các service mới
import { getChatResponse, getChatHistory, saveChatHistory, clearChatHistory } from '../../services/AIService'; 

import ReactMarkdown from 'react-markdown';
import './AIChat.css'; 

const AIChat = ({ storeContextData }) => {
  // Xóa tin nhắn mặc định, chúng ta sẽ tải nó từ server
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // State load lịch sử

  // Ref for chat body to auto-scroll
  const chatBodyRef = useRef(null);

  // --- MỚI: Tải lịch sử chat khi component được mở ---
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      const history = await getChatHistory();
      setMessages(history);
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, []); // Chạy 1 lần duy nhất

  // Auto-scroll to bottom when messages change or history loads
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoadingHistory]);
  // Clear chat history handler
  const handleClearHistory = async () => {
    setIsLoadingHistory(true);
    await clearChatHistory();
    setMessages([]);
    setIsLoadingHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: input };
    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    setInput("");
    setIsLoading(true);

    const historyForAI = newMessagesList.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }] 
    }));

    try {
      // *** CẬP NHẬT: Gửi thêm storeContextData ***
      const aiResponseText = await getChatResponse(
        historyForAI,       // Lịch sử chat
        input,              // Câu hỏi mới
        storeContextData    // Dữ liệu cửa hàng
      );
      
      const aiMessage = { role: "model", parts: aiResponseText };
      const finalMessageList = [...newMessagesList, aiMessage];
      setMessages(finalMessageList);
      
      await saveChatHistory(finalMessageList);

    } catch (error) {
      const errorMessage = { role: "model", parts: "Lỗi kết nối, vui lòng thử lại." };
      setMessages(prev => [...prev, errorMessage]);
      // (Không lưu lỗi vào lịch sử)
    }
    
    setIsLoading(false);
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span><FaRobot /> Trợ lý AI</span>
        <Button variant="outline-danger" size="sm" onClick={handleClearHistory} disabled={isLoadingHistory || isLoading}>
          Xoá lịch sử chat
        </Button>
      </Card.Header>

      <Card.Body style={{ height: '400px', overflowY: 'auto' }} ref={chatBodyRef}>
        {isLoadingHistory ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
            <p>Đang tải lịch sử chat...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              {msg.role === 'user' && (
                <span className="p-2 rounded bg-primary text-white" style={{ maxWidth: '80%' }}>
                  {msg.parts}
                </span>
              )}
              {msg.role === 'model' && (
                <div className="p-2 rounded bg-light model-response" style={{ maxWidth: '95%' }}>
                  <ReactMarkdown>{msg.parts}</ReactMarkdown>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && <div className="text-center"><Spinner animation="border" size="sm" /></div>}
      </Card.Body>

      <Card.Footer>
        <InputGroup>
          <Form.Control
            placeholder="Hỏi AI về dữ liệu, sản phẩm..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading || isLoadingHistory}
          />
          <Button onClick={handleSend} disabled={isLoading || isLoadingHistory}>
            <FaPaperPlane />
          </Button>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
};

export default AIChat;