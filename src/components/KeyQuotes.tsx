import React from 'react';
import { Quote as QuoteIcon, Info } from 'lucide-react';
import type { Quote } from '../types';
import './KeyQuotes.css';

interface KeyQuotesProps {
  quotes: Quote[];
}

const KeyQuotes: React.FC<KeyQuotesProps> = ({ quotes }) => {
  return (
    <div className="quotes-section">
      <h3 className="section-title">
        <QuoteIcon size={20} />
        Trích dẫn nổi bật
      </h3>
      
      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <div key={index} className="quote-card">
            <div className="quote-text">
              <QuoteIcon size={24} className="quote-mark" />
              <p>{quote.text}</p>
            </div>
            
            <div className="quote-context">
              <div className="context-info">
                <Info size={16} />
                <span>{quote.context}</span>
              </div>
            </div>
            
            <div className="quote-significance">
              <strong>Ý nghĩa: </strong>
              {quote.significance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyQuotes;
