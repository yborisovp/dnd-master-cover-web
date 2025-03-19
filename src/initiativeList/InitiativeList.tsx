import React, { useState } from "react";

import {
  FaDragon,
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { GiMagicPortal } from "react-icons/gi";

import { InitiativeCharacter } from "../models/initiative";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addCharacter,
  removeCharacter,
  rotateInitiative,
  selectCharacter,
  updateCharacter,
} from "../redux/slice/initiative.slice";

import styles from "./InitiativeList.module.scss";
import { MButton } from "../regular/button/Button";
import { useTranslation } from "react-i18next";

type InitiativeListProps = {
  collapsed?: boolean;
};
const InitiativeList = ({ collapsed }: InitiativeListProps) => {
  const { t } = useTranslation("common");

  const dispatch = useAppDispatch();
  const reduxState = useAppSelector(selectCharacter);
  const reduxItems: InitiativeCharacter[] = reduxState.initiativeList;

  const [editedItems, setEditedItems] = useState<InitiativeCharacter[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const startEditing = () => {
    setEditedItems([...reduxItems]);
    setIsEditMode(true);
  };

  // Update a field for an item in the editedItems array.
  const handleEdit = (
    id: string,
    field: keyof InitiativeCharacter,
    value: string | number | ""
  ) => {
    setEditedItems(
      editedItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Remove an item from the editedItems list.
  const handleRemove = (id: string) => {
    setEditedItems(editedItems.filter((item) => item.id !== id));
  };

  // Save changes:
  // - For each item in editedItems, update or add.
  // - For each item in Redux that is missing in editedItems, dispatch remove.
  const saveChanges = () => {
    // Update or add characters.
    editedItems.forEach((item) => {
      // Assuming valid initiative is already a number.
      const validItem = { ...item, initiative: item.initiative || 0 };
      const exists = reduxItems.find((r) => r.id === validItem.id);
      if (exists) {
        dispatch(updateCharacter(validItem));
      } else {
        dispatch(addCharacter(validItem));
      }
    });
    // Remove characters that were deleted in edit mode.
    const editedIds = new Set(editedItems.map((i) => i.id));
    reduxItems.forEach((item) => {
      if (!editedIds.has(item.id)) {
        dispatch(removeCharacter({ id: item.id }));
      }
    });
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setEditedItems([]);
    setIsEditMode(false);
  };

  const addNewEntry = () => {
    const newEntry: InitiativeCharacter = {
      id: Date.now().toString(),
      name: "",
      initiative: 0,
      type: "player",
    };
    setEditedItems([...editedItems, newEntry]);
  };

  // Handler for rotating the initiative order: moves the first item to the end.
  const handleEndTurn = () => {
    dispatch(rotateInitiative());
  };

  // The active person is the first in the Redux list.
  const activePerson = reduxItems[0];

  const opened = (
    <>
      <h3>{t("app.initiative-list.initiative-order")}</h3>
      <div className={styles.headerContent} style={{ cursor: "pointer" }}>
        {activePerson !== undefined && (
          <div className={styles.activePerson}>
            {activePerson.type === "player" ? <FaUser /> : <FaDragon />}
            <span>{activePerson.name}</span>
            <span className={styles.initiativeBadge}>
              {activePerson.initiative}
            </span>
          </div>
        )}
      </div>
      <div className={styles.listContainer}>
        <div className={styles.tableHeader}>
          <span>{t("app.initiative-list.type")}</span>
          <span>{t("app.initiative-list.name")}</span>
          <span>{t("app.initiative-list.initiative")}</span>
          {isEditMode && <span>{t("app.initiative-list.actions")}</span>}
        </div>

        {(isEditMode ? editedItems : reduxItems).map((item) => (
          <div
            key={item.id}
            className={`${styles.listItem} ${styles[item.type]}`}
          >
            {isEditMode ? (
              <>
                <select
                  value={item.type}
                  onChange={(e) => handleEdit(item.id, "type", e.target.value)}
                  className={styles.typeSelect}
                >
                  <option value="player">
                    {t("app.initiative-list.player")}
                  </option>
                  <option value="enemy">
                    {t("app.initiative-list.enemy")}
                  </option>
                </select>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleEdit(item.id, "name", e.target.value)}
                  className={styles.nameInput}
                  placeholder={t("app.initiative-list.enter-name")}
                />
                <input
                  type="number"
                  value={item.initiative}
                  onChange={(e) =>
                    handleEdit(
                      item.id,
                      "initiative",
                      e.target.valueAsNumber || ""
                    )
                  }
                  className={styles.initiativeInput}
                  placeholder="0"
                />
                <MButton
                  className={styles.iconButton}
                  isSuggest={true}
                  onClick={() => handleRemove(item.id)}
                >
                  <FaTrash />
                </MButton>
              </>
            ) : (
              <>
                <span className={styles.typeBadge}>
                  {item.type === "player" ? <FaUser /> : <FaDragon />}
                </span>
                <span className={styles.name}>
                  {item.name || t("app.initiative-list.unnamed")}
                </span>
                <span className={styles.initiative}>{item.initiative}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        {isEditMode ? (
          <>
            <MButton
              className={styles.iconButton}
              isSuggest={true}
              onClick={addNewEntry}
            >
              <FaPlus />
            </MButton>
            <MButton
              className={styles.iconButton}
              isSuggest={true}
              onClick={saveChanges}
            >
              <FaSave />
            </MButton>
            <MButton
              className={styles.iconButton}
              isSuggest={true}
              onClick={cancelEdit}
            >
              <FaTimes />
            </MButton>
          </>
        ) : (
          <>
            <MButton
              className={styles.iconButton}
              isSuggest={true}
              onClick={startEditing}
            >
              <FaEdit />
            </MButton>
            {/* New End Turn MButton */}
            <MButton
              className={styles.iconButton}
              isSuggest={true}
              onClick={handleEndTurn}
            >
              {t("app.initiative-list.end-turn")}
            </MButton>
          </>
        )}
      </div>
    </>
  );

  const collapsedComponent = (
    <>
      <div className={styles.headerContent}>
        <div className={styles.activePerson}>
          {activePerson === undefined ? (
            <GiMagicPortal size={40} />
          ) : (
            <>
              {activePerson.type === "player" ? <FaUser /> : <FaDragon />}

              <span className={styles.initiativeBadge}>
                {activePerson.initiative}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
  return (
    <div
      className={`${styles.initiativeList} 
      ${collapsed && styles.slaveCollapse}`}
      onClick={() => collapsed && handleEndTurn()}
    >
      <div className={styles.header}>
        {collapsed != null && collapsed ? collapsedComponent : opened}
      </div>
    </div>
  );
};

export default InitiativeList;
