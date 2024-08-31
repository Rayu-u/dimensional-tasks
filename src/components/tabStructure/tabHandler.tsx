import React, { useState } from "react";

interface Tab {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const TabHandler: React.FC<TabsProps> = ({ tabs }) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(1);

  const handleTabClick = (index: number) => {
    setActiveScreenIndex(index);
  };

  return (
    <div>
      <div style={{ display: "flex", cursor: "pointer", marginBottom: "10px" }}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => handleTabClick(index)}
            style={{
              padding: "10px 20px",
              borderBottom:
                activeScreenIndex === index
                  ? "2px solid #007bff"
                  : "2px solid transparent",
              fontWeight: activeScreenIndex === index ? "bold" : "normal",
            }}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        {tabs[activeScreenIndex].content}
      </div>
    </div>
  );
};

export default TabHandler;
