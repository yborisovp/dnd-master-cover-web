import { ChangeEvent, useState } from "react";

import {
  FaBolt,
  FaFire,
  FaMinus,
  FaPen,
  FaPlus,
  FaQuestion,
  FaSnowflake,
  FaTrashCan,
} from "react-icons/fa6";

import styles from "./Enemy.module.scss";
import { Ability, EnemyData } from "../models/enemy";
import { MButton } from "../regular/button/Button";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt, FaFistRaised, FaSave, FaTint } from "react-icons/fa";
import MAccordion from "../regular/accordion/Accordion";
import MWrapper from "../regular/wrapper/Wrapper";
import { useAppDispatch } from "../redux/hooks";
import { removeEnemy } from "../redux/slice/enemies.slice";
import { removeCharacterByUniqueName } from "../redux/slice/initiative.slice";

export interface EnemyProps {
  localId: number;
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

const Enemy = ({ localId, enemy, onUpdate }: EnemyProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [isEditing, setIsEditing] = useState(false);
  const [editableEnemy, setEditableEnemy] = useState<EnemyData>(enemy);

  // For controlling the Damage/Heal inputs
  const [damageValue, setDamageValue] = useState<number | undefined>();
  const [healValue, setHealValue] = useState<number | undefined>();

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
      [name]: name === "hp" || name === "maxHp" ? Number(value) : value,
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
      <div className={`${styles.header} ${isEditing && styles.editing}`}>
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

        <div className={`${styles.rightGroup} ${isEditing && styles.editing}`}>
          {/* Danger Level + Edit/Save in the top-right */}
          {isEditing && (
            <>
              <MButton
                isSuggest
                className={styles.editButton}
                onClick={() => {
                  dispatch(removeEnemy(localId));
                  dispatch(removeCharacterByUniqueName(``));
                }}
              >
                <>
                  <FaTrashCan /> {t("app.enemy.delete")}
                </>
              </MButton>
            </>
          )}
          <span
            className={`${styles.dangerLevel} ${
              styles[
                `dangerLevel--${dangerLevelStyle(editableEnemy.dangerLevel)}`
              ]
            }`}
          >
            {editableEnemy.dangerLevel}
          </span>
          <MButton
            isSuggest
            className={styles.editButton}
            onClick={handleToggleEdit}
          >
            {isEditing ? (
              <>
                <FaSave /> {t("app.enemy.save")}
              </>
            ) : (
              <>
                <FaPen /> {t("app.enemy.edit")}
              </>
            )}
          </MButton>
        </div>
      </div>

      {/* STATS (HP, Max HP, Class) */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <label>HP</label>
          {isEditing ? (
            <div className={styles.editorContainer}>
              <div>
                <div>Current HP</div>
                <input
                  type="number"
                  name="hp"
                  value={editableEnemy.hp}
                  onChange={handleInputChange}
                  className={styles.hpInput}
                />
              </div>
              <div>
                <div>Max HP</div>
                <input
                  type="number"
                  name="maxHp"
                  value={
                    editableEnemy.maxHp !== undefined
                      ? editableEnemy.maxHp
                      : editableEnemy.hp
                  }
                  onChange={handleInputChange}
                  className={styles.hpInput}
                />
              </div>
            </div>
          ) : (
            <>
              <span className={styles.hp}>
                {editableEnemy.hp} / {maxHp}
              </span>
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
          <label>{t("app.enemy.armor-class")}</label>
          {isEditing ? (
            <div className={styles.editorContainer}>
              <input
                type="text"
                name="class"
                value={editableEnemy.class}
                onChange={handleInputChange}
                className={styles.classInput}
              />
            </div>
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
            className={styles.damageInput}
          />

          <MButton onClick={handleDamage} className={styles.damageButton}>
            <>
              <FaMinus /> {t("app.enemy.damage")}
            </>
          </MButton>
        </div>
        <div className={styles.healControl}>
          <input
            type="number"
            value={healValue}
            onChange={(e) => setHealValue(Number(e.target.value))}
            className={styles.healInput}
          />
          <MButton onClick={handleHeal} className={styles.healButton}>
            <>
              <FaPlus /> {t("app.enemy.heal")}
            </>
          </MButton>
        </div>
      </div>

      {/* DESCRIPTION */}

      <div className={styles.descriptionSection}>
        <MAccordion title={t("app.enemy.description")}>
          <>
            {isEditing ? (
              <textarea
                rows={8}
                name="description"
                value={editableEnemy.description}
                onChange={handleInputChange}
                className={styles.descriptionInput}
              />
            ) : (
              <>
                {editableEnemy.description.split("\n").map((el) => {
                  if (el.trim() === "") return <></>;

                  return <MWrapper>{el.trim()}</MWrapper>;
                })}
              </>
            )}
          </>
        </MAccordion>
      </div>

      {/* ABILITIES */}
      <div className={styles.abilities}>
        <MAccordion title={t("app.enemy.abilites")}>
          <>
            {editableEnemy.abilities.map((ability, index) => (
              <div key={index} className={styles.ability}>
                <div className={styles.abilityHeader}>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="weaponType"
                        value={ability.weaponType}
                        onChange={(e) =>
                          handleAbilityChange(
                            index,
                            "weaponType",
                            e.target.value
                          )
                        }
                        className={styles.abilityInput}
                        placeholder={t("app.enemy.weapon-type")}
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
                        placeholder={t("app.enemy.dice-roll")}
                      />
                      <input
                        type="text"
                        name="damageType"
                        value={ability.damageType ?? ""}
                        onChange={(e) =>
                          handleAbilityChange(
                            index,
                            "damageType",
                            e.target.value
                          )
                        }
                        className={styles.abilityInput}
                        placeholder={t("app.enemy.damage-type")}
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
                    placeholder={t("app.enemy.ability-description")}
                  />
                ) : (
                  <p className={styles.abilityDescription}>
                    {ability.description}
                  </p>
                )}
              </div>
            ))}
          </>
        </MAccordion>
      </div>
    </div>
  );
};

export default Enemy;
