import React, { useEffect, useState } from "react";
import { lessonData } from "../data/lessonData";
import VideoSection from "../components/VideoSection";
import Timeline from "../components/Timeline";
import KeyQuotes from "../components/KeyQuotes";
import "./LessonIntroduction.css";

// Helper function to recursively render content
function renderContent(content: any, key: any) {
  if (typeof content === "string") {
    return <p key={key}>{content}</p>;
  } else if (
    typeof content === "object" &&
    content !== null &&
    "title" in content &&
    Array.isArray(content.content)
  ) {
    return (
      <div key={key}>
        <strong>{content.title}</strong>
        {content.content.map((sub: any, subIdx: any) => renderContent(sub, subIdx))}
      </div>
    );
  }
  return null;
}

const LessonIntroduction: React.FC = () => {
  const [openItem, setOpenItem] = useState<{
    cardIndex: number;
    itemIndex: number;
  } | null>(null);

  const toggleItem = (cardIndex: number, itemIndex: number) => {
    if (
      openItem?.cardIndex === cardIndex &&
      openItem?.itemIndex === itemIndex
    ) {
      setOpenItem(null); // nếu click lại vào item đang mở -> đóng
    } else {
      setOpenItem({ cardIndex, itemIndex });
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? lessonData.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === lessonData.images.length - 1 ? 0 : prev + 1
    );
  };
   useEffect(() => {
    const interval = setInterval(nextImage, 5000); 
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="lesson-container">
      <h1 className="lesson-title">{lessonData.title}</h1>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="lesson-summary">
              {lessonData.summary.map((paragraph, index) => (
                <p key={index} className="summary-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lessonData.images.length > 0 && (
        <div className="carousel">
          <div
            className="carousel-inner"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {lessonData.images.map((image, index) => (
              <div className="carousel-item" key={index}>
                <img
                  src={image}
                  alt={`Hình minh họa ${index + 1}`}
                  className="lesson-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IaW5oIGFuaCBtaW5oIGjGsGE8L3RleHQ+PC9zdmc+";
                  }}
                />
              </div>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevImage}>
            ❮
          </button>
          <button className="carousel-btn next" onClick={nextImage}>
            ❯
          </button>

          <div className="carousel-dots">
            {lessonData.images.map((_, index) => (
              <span
                key={index}
                className={index === currentImageIndex ? "dot active" : "dot"}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      )}


      <section className="content-section">
        <div className="content-wrapper">
          {lessonData.cards.map((card, cardIndex) => (
            <div key={cardIndex} className={`lesson-card border-${card.color}`}>
              <div className="card-content">
                <h3 className={`card-title text-${card.color}`}>
                  {cardIndex + 1}. {card.title}
                </h3>
                <ul>
                  {card.items.map((item, itemIndex) => (
                    <li
                      className="card-li"
                      key={itemIndex}
                      onClick={() => toggleItem(cardIndex, itemIndex)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{item.title}</strong>
                      {openItem?.cardIndex === cardIndex &&
                        openItem?.itemIndex === itemIndex && (
                          <div className={`item-content border-${card.color}`}>
                            {item.content.map((line, idx) => renderContent(line, idx))}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      {lessonData.videos && lessonData.videos.length > 0 && (
        <VideoSection videos={lessonData.videos} />
      )}

      {/* Timeline Section */}
      {lessonData.timeline && lessonData.timeline.length > 0 && (
        <Timeline timeline={lessonData.timeline} />
      )}

      {/* Key Quotes Section */}
      {lessonData.keyQuotes && lessonData.keyQuotes.length > 0 && (
        <KeyQuotes quotes={lessonData.keyQuotes} />
      )}

      {/* Interactive Elements Section */}
      {/* {lessonData.interactiveElements && lessonData.interactiveElements.length > 0 && (
        <InteractiveElements elements={lessonData.interactiveElements} />
      )} */}

      <div className="lesson-footer">
        <p className="study-tip">
          💡 <strong>Gợi ý học tập:</strong> Hãy đọc kỹ nội dung trên và ghi chú
          những điểm quan trọng trước khi làm bài kiểm tra. Bạn có thể quay lại
          trang này bất cứ lúc nào để ôn tập.
        </p>
      </div>
    </div>
  );
};

export default LessonIntroduction;
