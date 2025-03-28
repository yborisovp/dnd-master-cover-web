interface PentagonIconProps {
  label: string;
}
const PentagonIcon: React.FC<PentagonIconProps> = ({ label }) => {
  // Estimate the available horizontal space inside the pentagon at text level
  // ViewBox is 24 wide. Polygon goes from x=3 to x=21 (width 18 at widest).
  // Stroke width is 2, so subtract 2 from each side effectively. Inner width ~14.
  // Let's target textLength slightly smaller than that for margins.
  const targetTextLength = 10; // Adjust this value based on visual result

  // Adjust font size for readability within the constrained space
  const fontSize = 8.5; // Smaller font allows more visual margin

  // Adjust Y position for vertical centering/margin
  const yPosition = 13; // Center or slightly below

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
    >
      {/* 1. Pentagon Outline */}
      <polygon
        points="12,2 21,9 17,21 7,21 3,9"
        fill="none" // No fill on the outline shape itself
        stroke="currentColor" // Outline color from CSS
        strokeWidth="2" // Standard stroke width (adjust if needed: 1.5, 2, 2.5)
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Text Inside with Constraints */}
      <text
        x="12" // Center horizontally
        y={yPosition} // Position vertically
        textAnchor="middle" // Anchor text in the middle horizontally
        dominantBaseline="central" // More reliable vertical centering baseline
        fill="currentColor" // Text color from CSS
        fontSize={fontSize}
        fontWeight="600" // Medium-bold, adjust if needed (bold, 500, etc.)
        stroke="none" // No stroke on the text itself
        // *** Key Attributes for Margins ***
        textLength={targetTextLength} // Constrain the total rendered width of the text
        lengthAdjust="spacingAndGlyphs" // Allow SVG to adjust spacing AND glyph shape to fit
      >
        {label}
      </text>
    </svg>
  );
};

export default PentagonIcon;
