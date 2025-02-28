import React, { useState } from "react";

import {
  FaCaretDown,
  FaCaretUp,
  FaDragon,
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import { InitiativeCharacter } from "../models/initiative";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addCharacter,
  removeCharacter,
  rotateInitiative,
  selectCharacter,
  updateCharacter,
} from "../redux/initiativeSlice";

import styles from "./InitiativeList.module.scss";

const InitiativeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const reduxState = useAppSelector(selectCharacter);
  const reduxItems: InitiativeCharacter[] = reduxState.initiativeList;

  const [editedItems, setEditedItems] = useState<InitiativeCharacter[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const startEditing = () => {
    setEditedItems([...reduxItems]);
    setIsEditMode(true);
    setIsCollapsed(false);
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

  return (
    <div
      className={`${styles.initiativeList} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      {/* HEADER */}
      <div className={styles.header}>
        <div
          className={styles.headerContent}
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: "pointer" }}
        >
          <h3>Initiative Order</h3>
          {isCollapsed && activePerson && (
            <div className={styles.activePerson}>
              {activePerson.type === "player" ? <FaUser /> : <FaDragon />}
              <span>{activePerson.name}</span>
              <span className={styles.initiativeBadge}>
                {activePerson.initiative}
              </span>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          {isEditMode ? (
            <>
              <button className={styles.iconButton} onClick={addNewEntry}>
                <FaPlus />
              </button>
              <button className={styles.iconButton} onClick={saveChanges}>
                <FaSave />
              </button>
              <button className={styles.iconButton} onClick={cancelEdit}>
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button className={styles.iconButton} onClick={startEditing}>
                <FaEdit />
              </button>
              {/* New End Turn button */}
              <button className={styles.iconButton} onClick={handleEndTurn}>
                End Turn
              </button>
            </>
          )}
          <button
            className={styles.iconButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaCaretDown /> : <FaCaretUp />}
          </button>
        </div>
      </div>

      {/* LIST */}
      {!isCollapsed && (
        <div className={styles.listContainer}>
          <div className={styles.tableHeader}>
            <span>Type</span>
            <span>Name</span>
            <span>Initiative</span>
            {isEditMode && <span>Actions</span>}
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
                    onChange={(e) =>
                      handleEdit(item.id, "type", e.target.value)
                    }
                    className={styles.typeSelect}
                  >
                    <option value="player">Player</option>
                    <option value="enemy">Enemy</option>
                  </select>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleEdit(item.id, "name", e.target.value)
                    }
                    className={styles.nameInput}
                    placeholder="Enter name"
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
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemove(item.id)}
                  >
                    <FaTrash />
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.typeBadge}>
                    {item.type === "player" ? <FaUser /> : <FaDragon />}
                  </span>
                  <span className={styles.name}>{item.name || "Unnamed"}</span>
                  <span className={styles.initiative}>{item.initiative}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InitiativeList;
