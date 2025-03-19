import React, { ChangeEvent, useState } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  FaArrowsAlt,
  FaBolt,
  FaEdit,
  FaFire,
  FaFistRaised,
  FaMinus,
  FaPlus,
  FaQuestion,
  FaSave,
  FaSnowflake,
  FaTint,
} from "react-icons/fa";

import styles from "./Enemy.module.scss";
import { Ability, EnemyData } from "../models/enemy";

export interface EnemyProps {
  enemy: EnemyData;
  onUpdate?: (enemy: EnemyData) => void;
}

const getDamageIcon = (damageType: string | null) => {
  switch (damageType?.toLowerCase()) {
    case "acid":
      return <FaTint />;
    case "fire":
      return <FaFire />;
    case "cold":
      return <FaSnowflake />;
    case "electric":
      return <FaBolt />;
    case "slashing":
      return <FaFistRaised />;
    default:
      return <FaQuestion />;
  }
};

export const parseFraction = (value: string | number): number => {
  if (typeof value === "number") return value;
  if (value.includes("/")) {
    const parts = value.split("/");
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }
  return parseFloat(value) || 0;
};

// Function to determine danger level style based on numeric value
export const dangerLevelStyle = (level: string | number): string => {
  const numericLevel = parseFraction(level);
  if (numericLevel < 2) {
    return "low";
  } else if (numericLevel < 7) {
    return "medium";
  } else if (numericLevel < 12) {
    return "high";
  } else {
    return "extreme";
  }
};

const Enemy = ({ enemy, onUpdate }: EnemyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableEnemy, setEditableEnemy] = useState<EnemyData>(enemy);

  // For controlling the Damage/Heal inputs
  const [damageValue, setDamageValue] = useState<number>(0);
  const [healValue, setHealValue] = useState<number>(0);

  // New states for collapsible sections
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isAbilitiesCollapsed, setIsAbilitiesCollapsed] = useState(true);

  // Toggle between edit and view mode
  const handleToggleEdit = () => {
    if (isEditing && onUpdate) {
      onUpdate(editableEnemy);
    }
    setIsEditing(!isEditing);
  };

  // Handle text/number changes for the editable enemy fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableEnemy((prev) => ({
      ...prev,
      [name]: name === "hp" ? Number(value) : value,
    }));
  };

  // Handle ability field changes
  const handleAbilityChange = (
    index: number,
    field: keyof Ability,
    value: string
  ) => {
    const updatedAbilities = editableEnemy.abilities.map((ability, i) =>
      i === index ? { ...ability, [field]: value } : ability
    );
    setEditableEnemy((prev) => ({ ...prev, abilities: updatedAbilities }));
  };

  // Add damage to HP
  const handleDamage = () => {
    if (!damageValue) return;
    const maxHp = editableEnemy.maxHp || editableEnemy.hp;
    const newHp = Math.max(0, editableEnemy.hp - damageValue);
    setEditableEnemy((prev) => ({ ...prev, hp: newHp }));
    setDamageValue(0);
  };

  // Heal HP
  const handleHeal = () => {
    if (!healValue) return;
    const maxHp = editableEnemy.maxHp || editableEnemy.hp;
    const newHp = Math.min(maxHp, editableEnemy.hp + healValue);
    setEditableEnemy((prev) => ({ ...prev, hp: newHp }));
    setHealValue(0);
  };

  // Determine max HP if not explicitly provided
  const maxHp = editableEnemy.maxHp || editableEnemy.hp;

  return (
    <div className={styles.enemy}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.leftGroup}>
          {/* Drag Handle in the top-left */}
          <span className={styles.dragHandle}>
            <FaArrowsAlt />
          </span>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editableEnemy.name}
              onChange={handleInputChange}
              className={styles.nameInput}
            />
          ) : (
            <a href={enemy.link} target="blank">
              <h2 className={styles.name}>{editableEnemy.name}</h2>
            </a>
          )}
        </div>

        <div className={styles.rightGroup}>
          {/* Danger Level + Edit/Save in the top-right */}
          <span
            className={`${styles.dangerLevel} ${
              styles[
                `dangerLevel--${dangerLevelStyle(editableEnemy.dangerLevel)}`
              ]
            }`}
          >
            {editableEnemy.dangerLevel}
          </span>
          <button className={styles.editButton} onClick={handleToggleEdit}>
            {isEditing ? (
              <>
                <FaSave /> Save
              </>
            ) : (
              <>
                <FaEdit /> Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* STATS (HP, Class) */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <label>HP</label>
          {isEditing ? (
            <input
              type="number"
              name="hp"
              value={editableEnemy.hp}
              onChange={handleInputChange}
              className={styles.hpInput}
            />
          ) : (
            <>
              <span className={styles.hp}>{editableEnemy.hp}</span>
              <div className={styles.healthBar}>
                <div
                  className={styles.healthBarFill}
                  style={{ width: `${(editableEnemy.hp / maxHp) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.stat}>
          <label>Armor class</label>
          {isEditing ? (
            <input
              type="text"
              name="class"
              value={editableEnemy.class}
              onChange={handleInputChange}
              className={styles.classInput}
            />
          ) : (
            <span className={styles.class}>{editableEnemy.class}</span>
          )}
        </div>
      </div>

      {/* DAMAGE & HEAL CONTROLS */}
      <div className={styles.hpControls}>
        <div className={styles.damageControl}>
          <input
            type="number"
            value={damageValue}
            onChange={(e) => setDamageValue(Number(e.target.value))}
            placeholder="Damage"
            className={styles.damageInput}
          />
          <button onClick={handleDamage} className={styles.damageButton}>
            <FaMinus /> Damage
          </button>
        </div>
        <div className={styles.healControl}>
          <input
            type="number"
            value={healValue}
            onChange={(e) => setHealValue(Number(e.target.value))}
            placeholder="Heal"
            className={styles.healInput}
          />
          <button onClick={handleHeal} className={styles.healButton}>
            <FaPlus /> Heal
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className={styles.descriptionSection}>
        <h4
          onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
          style={{ cursor: "pointer" }}
        >
          Description{" "}
          {isDescriptionCollapsed ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </h4>
        {!isDescriptionCollapsed &&
          (isEditing ? (
            <textarea
              name="description"
              value={editableEnemy.description}
              onChange={handleInputChange}
              className={styles.descriptionInput}
            />
          ) : (
            <p className={styles.description}>{editableEnemy.description}</p>
          ))}
      </div>

      {/* ABILITIES */}
      <div className={styles.abilities}>
        <h3
          onClick={() => setIsAbilitiesCollapsed(!isAbilitiesCollapsed)}
          style={{ cursor: "pointer" }}
        >
          Abilities{" "}
          {isAbilitiesCollapsed ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </h3>
        {!isAbilitiesCollapsed &&
          editableEnemy.abilities.map((ability, index) => (
            <div key={index} className={styles.ability}>
              <div className={styles.abilityHeader}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="weaponType"
                      value={ability.weaponType}
                      onChange={(e) =>
                        handleAbilityChange(index, "weaponType", e.target.value)
                      }
                      className={styles.abilityInput}
                      placeholder="Weapon Type"
                    />
                    <input
                      type="text"
                      name="diceRoll"
                      value={ability.hitDiceRoll ?? ""}
                      onChange={(e) =>
                        handleAbilityChange(
                          index,
                          "hitDiceRoll",
                          e.target.value
                        )
                      }
                      className={styles.abilityInput}
                      placeholder="Dice Roll"
                    />
                    <input
                      type="text"
                      name="damageType"
                      value={ability.damageType ?? ""}
                      onChange={(e) =>
                        handleAbilityChange(index, "damageType", e.target.value)
                      }
                      className={styles.abilityInput}
                      placeholder="Damage Type"
                    />
                  </>
                ) : (
                  <>
                    <span className={styles.weaponType}>
                      {ability.weaponType}
                    </span>
                    <span className={styles.diceRoll}>
                      {ability.attackDiceRoll}
                    </span>
                    <span className={styles.diceRoll}>
                      {ability.hitDiceRoll}
                    </span>
                    <span className={styles.damageType}>
                      {getDamageIcon(ability.damageType)} {ability.damageType}
                    </span>
                  </>
                )}
              </div>
              {isEditing ? (
                <textarea
                  name="abilityDescription"
                  value={ability.description}
                  onChange={(e) =>
                    handleAbilityChange(index, "description", e.target.value)
                  }
                  className={styles.abilityDescriptionInput}
                  placeholder="Ability Description"
                />
              ) : (
                <p className={styles.abilityDescription}>
                  {ability.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Enemy;
