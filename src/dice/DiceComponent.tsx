// Dice.tsx
import React, { useState, useEffect, useRef } from "react";
import { rollDice, DiceConfig } from "./dice"; // Assuming rollDice exists
import styles from "./DiceComponent.module.scss";
import PentagonIcon from "./PentagonIcon";

const standardDice = [4, 6, 8, 10, 12, 20, 100];
const MAX_RESULTS = 5;
const RESULT_VISIBILITY_DURATION = 5000;

interface DiceComponentProps {
  resultsPosition?: "left" | "right";
}

interface DiceResult {
  id: string;
  config: DiceConfig;
  rolls: number[];
  visible: boolean;
}

const DiceComponent: React.FC<DiceComponentProps> = ({
  resultsPosition = "right",
}) => {
  const [sides, setSides] = useState<number>(6);
  const [customSides, setCustomSides] = useState<string>("");
  const [selectedDiceType, setSelectedDiceType] = useState<string>("6");
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<DiceResult[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const controlsRef = useRef<HTMLDivElement>(null); // Ref for the entire controls area (buttons + menu)
  const customInputRef = useRef<HTMLInputElement>(null);

  // --- Timeout Management ---
  useEffect(() => {
    const timeoutsMap = timeoutsRef.current;
    return () => {
      timeoutsMap.forEach(clearTimeout);
      timeoutsMap.clear();
    };
  }, []);

  const clearResultTimeout = (id: string) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id)!);
      timeoutsRef.current.delete(id);
    }
  };

  const setResultTimeout = (id: string) => {
    clearResultTimeout(id);
    const timeoutId = setTimeout(() => {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, visible: false } : r))
      );
      timeoutsRef.current.delete(id);
    }, RESULT_VISIBILITY_DURATION);
    timeoutsRef.current.set(id, timeoutId);
  };

  // --- Click Outside Handler ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close menu if click is outside the entire controls area
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node)
      ) {
        setIsSelectorOpen(false);
      }
    };

    if (isSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectorOpen]);

  // --- Event Handlers ---

  const handleToggleSelector = () => {
    setIsSelectorOpen((prev) => !prev);
  };

  const handleSelectDie = (selectedSidesValue: number) => {
    setSides(selectedSidesValue);
    setSelectedDiceType(selectedSidesValue.toString());
    setCustomSides("");
    setIsSelectorOpen(false); // Close selector after selection
  };

  const handleSelectCustom = () => {
    setSelectedDiceType("custom");
    setTimeout(() => customInputRef.current?.focus(), 0);
    setSides(Math.max(2, Number(customSides) || 2));
    // Keep menu open for input
  };

  const handleCustomSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSides(value);
    setSides(Math.max(2, Number(value) || 2));
  };

  const handleRoll = async () => {
    // Ensure selector is closed on roll for clarity, though not strictly necessary now
    if (isSelectorOpen) {
      setIsSelectorOpen(false);
    }

    if (loading || sides < 2) return;

    setLoading(true);
    try {
      const config: DiceConfig = { dice: 1, sides }; // Always 1 die now
      const res = await rollDice(config);

      const newResultId = Date.now().toString();
      setResultTimeout(newResultId);

      const newResult: DiceResult = {
        id: newResultId,
        config,
        rolls: res.results,
        visible: true,
      };

      setResults((prev) => {
        if (prev.length >= MAX_RESULTS) {
          clearResultTimeout(prev[MAX_RESULTS - 1].id);
        }
        return [newResult, ...prev].slice(0, MAX_RESULTS);
      });
    } catch (error) {
      console.error("Error rolling dice:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (id: string) => {
    setResults((prev) =>
      prev.map((result) => {
        if (result.id === id) {
          const newVisible = !result.visible;
          clearResultTimeout(id);
          if (newVisible) {
            setResultTimeout(id);
          }
          return { ...result, visible: newVisible };
        }
        return result;
      })
    );
  };

  const getSelectorButtonLabel = () => {
    if (selectedDiceType === "custom") {
      return customSides ? `d${customSides}` : "dN";
    }
    return `d${sides}`;
  };

  return (
    <div className={`${styles.container} ${styles[resultsPosition]}`}>
      {/* Results Area */}
      <div className={styles.resultsWrapper}>
        {/* Results are added here, new ones prepended */}
        {results.map((result) => (
          <div
            key={result.id}
            className={`${styles.result} ${
              result.visible ? styles.visible : styles.hidden
            }`}
          >
            <button
              className={styles.closeButton}
              onClick={() => toggleVisibility(result.id)}
              aria-label={result.visible ? "Hide result" : "Show result"}
            >
              ✕
            </button>
            <div className={styles.resultHeader}>
              {/* Simplified for 1 die */}d{result.config.sides} ={" "}
              {result.rolls[0]} {/* Assuming always 1 roll */}
            </div>
            {/* Optional: If you still want to show multiple rolls (e.g., advantage), keep the map */}
            {/* <div className={styles.diceRolls}>
              {result.rolls.map((roll, i) => (
                <span key={i} className={styles.diceValue}>
                  {roll}
                </span>
              ))}
            </div> */}
          </div>
        ))}
      </div>
      {/* Compact Controls Area */}
      {/* Ref is now on the outer div containing both buttons */}
      <div className={styles.controls} ref={controlsRef}>
        {/* Button to open die type selector */}
        <div className={styles.selectorContainer}>
          {" "}
          {/* Wrapper for selector button + menu */}
          <button
            className={styles.selectorButton}
            onClick={handleToggleSelector}
            aria-haspopup="true"
            aria-expanded={isSelectorOpen}
            title={`Select Die Type (Current: ${getSelectorButtonLabel()})`}
            aria-label={`Select Die Type (Current: ${getSelectorButtonLabel()})`}
          >
            <PentagonIcon label={getSelectorButtonLabel()} />
          </button>
          {/* Selector Menu (Dropdown) */}
          {isSelectorOpen && (
            <div className={styles.selectorMenu}>
              {standardDice.map((d) => (
                <button
                  key={d}
                  className={`${styles.selectorItem} ${
                    sides === d && selectedDiceType !== "custom"
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleSelectDie(d)}
                >
                  d{d}
                </button>
              ))}
              {/* Custom 'dN' Option */}
              <div
                className={`${styles.selectorItem} ${styles.customOption} ${
                  selectedDiceType === "custom" ? styles.selected : ""
                }`}
                onClick={handleSelectCustom} // Selects custom type
              >
                <span>dN</span>
                <input
                  ref={customInputRef}
                  type="number"
                  value={customSides}
                  min="2"
                  onChange={handleCustomSidesChange}
                  onClick={(e) => e.stopPropagation()} // Prevent closing menu
                  onKeyDown={(e) => {
                    // Optional: Roll on Enter in custom input
                    if (e.key === "Enter") {
                      setIsSelectorOpen(false); // Close menu
                      handleRoll(); // Trigger roll
                    }
                  }}
                  placeholder="Sides"
                  aria-label="Custom Number of Sides"
                  className={styles.customInput}
                />
              </div>
            </div>
          )}
        </div>{" "}
        {/* End selectorContainer */}
        {/* Explicit Roll Button */}
        <button
          className={styles.rollButton}
          onClick={handleRoll}
          disabled={loading || sides < 2}
          title={`Roll ${getSelectorButtonLabel()}`}
          aria-label={`Roll ${getSelectorButtonLabel()}`}
        >
          {loading ? "..." : "Roll"}
          {loading && <span className={styles.spinner}></span>}
        </button>
      </div>{" "}
      {/* End controls */}
    </div> // End container
  );
};

export default DiceComponent;
