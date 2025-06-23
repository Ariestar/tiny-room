import React from "react";
import "../styles/components/SectionNavigator.scss";

interface SectionNavigatorProps {
  sections: { id: number }[];
  currentSection: number;
  onSelectSection: (id: number) => void;
  isScrolling: boolean;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({ sections, currentSection, onSelectSection, isScrolling }) => {
  return (
    <div className="section-indicators">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`indicator${currentSection === section.id ? ' active' : ''}`}
          onClick={() => {
            if (!isScrolling) {
              onSelectSection(section.id);
            }
          }}
          aria-label={`Go to section ${section.id + 1}`}
        />
      ))}
    </div>
  );
};

export default SectionNavigator; 