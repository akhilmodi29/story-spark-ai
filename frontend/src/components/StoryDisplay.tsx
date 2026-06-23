import React, { useState, useMemo, ChangeEvent } from 'react';

// --- Sample Stories Data ---
const SAMPLE_STORIES: string[] = [
  "The old clock tower struck midnight. Rain lashed against the cracked window pane as Detective Vance stared at the map laid out across his desk. Every clue pointed to the docks, but his gut told him otherwise. He grabbed his coat, knowing tonight would change everything.",
  "Deep within the Whispering Woods, a small glowing fox stepped softly across the mossy floor. Legends told of its ability to guide lost travelers back to safety, but only if they offered a secret in return. Elara stood frozen, deciding which of her deep regrets she was willing to part with.",
  "The countdown reached zero. Instead of the deafening roar of rocket thrusters, there was only silence. The monitors in Mission Control blinked red one by one. Dr. Aris looked out the observation window at the launchpad, realizing the sabotage had come from inside the team."
];

export const StoryDashboard: React.FC = () => {
  const [storyText, setStoryText] = useState<string>(
    "Click the button above to generate a story, or start typing directly inside this box to watch the statistics update automatically in real-time!"
  );

  // --- Acceptance Criteria Calculations ---
  // useMemo ensures calculations run only when storyText changes
  const stats = useMemo(() => {
    const cleanText = storyText.trim();
    
    // 1. Character count includes all visible text
    const characterCount = cleanText.length;

    // 2. Word count calculated correctly (handles arbitrary spaces/newlines safely)
    const wordsArray = cleanText.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = wordsArray.length;

    // 3. Reading time calculated using standard formula (words / 200)
    const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;

    return {
      characterCount,
      wordCount,
      readingTime,
    };
  }, [storyText]);

  // Handler to generate a random story (Simulates backend API / Generation)
  const generateRandomStory = (): void => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_STORIES.length);
    setStoryText(SAMPLE_STORIES[randomIndex]);
  };

  // Handler for direct user typing modifications
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setStoryText(e.target.value);
  };

  return (
    <div className="story-dashboard-container">
      {/* Dynamic Style Injection for Responsive Handling (No extra .css file needed) */}
      <style>{`
        .story-dashboard-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background-color: #121214;
          color: #f3f4f6;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .story-header h1 {
          font-size: 1.8rem;
          margin: 0 0 0.5rem 0;
        }
        .story-header p {
          color: #9ca3af;
          margin: 0;
        }
        .story-btn {
          background-color: #6366f1;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s ease;
          width: fit-content;
        }
        .story-btn:hover {
          background-color: #4f46e5;
        }
        .story-textarea {
          background-color: #1e1e24;
          color: #f3f4f6;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 1.5rem;
          min-height: 180px;
          line-height: 1.6;
          font-size: 1.1rem;
          resize: vertical;
          font-family: inherit;
          box-sizing: border-box;
        }
        .story-textarea:focus {
          outline: 2px solid #6366f1;
          border-color: transparent;
        }
        .stats-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          background-color: #1e1e24;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 1rem;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-right: 1px solid #374151;
        }
        .stat-card:last-child {
          border-right: none;
        }
        .stat-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f3f4f6;
        }
        @media (max-width: 600px) {
          .stat-card {
            border-right: none;
            border-bottom: 1px solid #374151;
            padding-bottom: 1rem;
          }
          .stat-card:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>

      <header className="story-header">
        <h1>Story Dashboard</h1>
        <p>Generate stories and view real-time readability insights.</p>
      </header>

      <div>
        <button onClick={generateRandomStory} className="story-btn">
          Generate New Story
        </button>
      </div>

      {/* Story Content Editor Box */}
      <textarea
        value={storyText}
        onChange={handleTextChange}
        className="story-textarea"
        placeholder="Type or generate a story here..."
      />

      {/* --- STATISTICS PANEL (Clean & Minimal UI) --- */}
      <section className="stats-panel" aria-label="Story Metrics">
        <div className="stat-card">
          <span className="stat-label">Words</span>
          <span className="stat-value">{stats.wordCount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Characters</span>
          <span className="stat-value">{stats.characterCount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Reading Time</span>
          <span className="stat-value">
            {stats.readingTime === 1 ? '1 min' : `${stats.readingTime} mins`}
          </span>
        </div>
      </section>
    </div>
  );
};

export default StoryDashboard;