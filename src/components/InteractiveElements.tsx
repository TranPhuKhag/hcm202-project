import React, { useState } from 'react';
import { MessageCircle, BarChart3, Lightbulb, Users } from 'lucide-react';
import type { InteractiveElement } from '../types';
import './InteractiveElements.css';

interface InteractiveElementsProps {
  elements: InteractiveElement[];
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({ elements }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [pollResults, setPollResults] = useState<Record<string, number[]>>({});

  const getElementIcon = (type: InteractiveElement['type']) => {
    switch (type) {
      case 'poll': return <BarChart3 size={20} />;
      case 'reflection': return <Lightbulb size={20} />;
      case 'discussion': return <MessageCircle size={20} />;
      case 'mindmap': return <Users size={20} />;
      default: return <Lightbulb size={20} />;
    }
  };

  const getElementTitle = (type: InteractiveElement['type']) => {
    switch (type) {
      case 'poll': return 'Khảo sát ý kiến';
      case 'reflection': return 'Suy ngẫm';
      case 'discussion': return 'Thảo luận';
      case 'mindmap': return 'Sơ đồ tư duy';
      default: return 'Hoạt động tương tác';
    }
  };

  const handlePollVote = (elementId: string, optionIndex: number) => {
    const currentResults = pollResults[elementId] || [];
    const newResults = [...currentResults];
    newResults[optionIndex] = (newResults[optionIndex] || 0) + 1;
    
    setPollResults(prev => ({
      ...prev,
      [elementId]: newResults
    }));
  };

  const handleReflectionSubmit = (elementId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [elementId]: response
    }));
  };

  const getTotalVotes = (elementId: string) => {
    const results = pollResults[elementId] || [];
    return results.reduce((sum, votes) => sum + votes, 0);
  };

  const renderElement = (element: InteractiveElement) => {
    switch (element.type) {
      case 'poll':
        return (
          <div className="poll-element">
            <p className="element-content">{element.content}</p>
            {element.options && (
              <div className="poll-options">
                {element.options.map((option, index) => {
                  const results = pollResults[element.id] || [];
                  const votes = results[index] || 0;
                  const totalVotes = getTotalVotes(element.id);
                  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={index} className="poll-option">
                      <button
                        onClick={() => handlePollVote(element.id, index)}
                        className="poll-option-button"
                      >
                        <span className="option-text">{option}</span>
                        {totalVotes > 0 && (
                          <div className="poll-result">
                            <div 
                              className="poll-bar"
                              style={{ width: `${percentage}%` }}
                            />
                            <span className="poll-percentage">{Math.round(percentage)}%</span>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
                {getTotalVotes(element.id) > 0 && (
                  <p className="poll-total">Tổng số lượt bình chọn: {getTotalVotes(element.id)}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'reflection':
        return (
          <div className="reflection-element">
            <p className="element-content">{element.content}</p>
            <div className="reflection-input">
              <textarea
                placeholder="Chia sẻ suy nghĩ của bạn..."
                value={responses[element.id] || ''}
                onChange={(e) => setResponses(prev => ({
                  ...prev,
                  [element.id]: e.target.value
                }))}
                rows={4}
              />
              <button
                onClick={() => handleReflectionSubmit(element.id, responses[element.id] || '')}
                className="submit-reflection"
                disabled={!responses[element.id]?.trim()}
              >
                Gửi suy ngẫm
              </button>
            </div>
            {responses[element.id] && (
              <div className="reflection-submitted">
                <p><strong>Suy ngẫm của bạn:</strong></p>
                <div className="reflection-response">
                  {responses[element.id]}
                </div>
              </div>
            )}
          </div>
        );

      case 'discussion':
        return (
          <div className="discussion-element">
            <p className="element-content">{element.content}</p>
            <div className="discussion-placeholder">
              <MessageCircle size={40} />
              <p>Tính năng thảo luận sẽ sớm được cập nhật!</p>
              <p>Hãy thảo luận chủ đề này với bạn bè và thầy cô.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="default-element">
            <p className="element-content">{element.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="interactive-section">
      <h3 className="section-title">
        <Users size={20} />
        Hoạt động tương tác
      </h3>
      
      <div className="elements-grid">
        {elements.map((element) => (
          <div key={element.id} className={`element-card ${element.type}`}>
            <div className="element-header">
              <div className="element-type">
                {getElementIcon(element.type)}
                <span>{getElementTitle(element.type)}</span>
              </div>
            </div>
            
            <div className="element-body">
              <h4 className="element-title">{element.title}</h4>
              {renderElement(element)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveElements;
