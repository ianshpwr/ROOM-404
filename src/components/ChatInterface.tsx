
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LogOut, Send, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp?: any;
}

interface ChatInterfaceProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
  handleLogout: () => void;
  currentUser: string;
}

const ChatInterface = ({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  handleLogout,
  currentUser
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen animate-fadeIn">
      <header className="p-4 glass-panel flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest flex items-center">
          <MessageSquare className="mr-2 h-6 w-6" />
          ROOM-404
        </h1>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="anon-button flex items-center gap-1"
        >
          {!isMobile && "DISCONNECT"}
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto glass-panel m-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
              <p>No messages yet. Start a conversation...</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.user === currentUser;
              
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] p-3 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-room404-gray text-white rounded-tr-none' 
                        : 'bg-room404-accent text-white rounded-tl-none'
                    }`}
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      {isCurrentUser ? 'You' : (msg.user || 'Anonymous')}
                    </div>
                    <p className="break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 glass-panel m-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="input-field flex-1"
          />
          <Button 
            onClick={sendMessage}
            className="anon-button flex items-center gap-1"
            disabled={!newMessage.trim()}
          >
            {!isMobile && "SEND"}
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
