import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FaPlus, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCaretUp, 
  FaCaretDown, 
  FaDragon, 
  FaUser, 
  FaGripVertical 
} from 'react-icons/fa';
import styles from './InitiativeList.module.scss';

export interface InitiativeItem {
  id: string;
  name: string;
  initiative: number | '';
  type: 'player' | 'enemy';
}

const InitiativeList: React.FC = () => {
  const [items, setItems] = useState<InitiativeItem[]>([
    { id: '1', name: 'Gandalf', initiative: 20, type: 'player' },
    { id: '2', name: 'Orc Captain', initiative: 18, type: 'enemy' },
    { id: '3', name: 'Aragorn', initiative: 22, type: 'player' },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  // Use a separate state for edited items so that we can reorder/edit without immediately affecting the main list
  const [editedItems, setEditedItems] = useState<InitiativeItem[]>(items);

  // Reorder editedItems on drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(editedItems);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setEditedItems(newItems);
  };

  const handleEdit = (id: string, field: keyof InitiativeItem, value: string | number | '') => {
    setEditedItems(
      editedItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveChanges = () => {
    const validItems = editedItems.map(item => ({
      ...item,
      initiative: item.initiative === '' ? 0 : item.initiative
    }));
    setItems(validItems);
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setEditedItems(items);
    setIsEditMode(false);
  };

  const addNewEntry = () => {
    const newEntry: InitiativeItem = {
      id: Date.now().toString(),
      name: '',
      initiative: '',
      type: 'player'
    };
    setEditedItems([...editedItems, newEntry]);
  };

  const activePerson = items[0];

  return (
    <div className={`${styles.initiativeList} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* HEADER (non-draggable) */}
      <div className={styles.header}>
        <div 
          className={styles.headerContent}
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer' }}
        >
          <h3>Initiative Order</h3>
          {isCollapsed && activePerson && (
            <div className={styles.activePerson}>
              {activePerson.type === 'player' ? <FaUser /> : <FaDragon />}
              <span>{activePerson.name}</span>
              <span className={styles.initiativeBadge}>{activePerson.initiative}</span>
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
            <button className={styles.iconButton} onClick={() => setIsEditMode(true)}>
              <FaEdit />
            </button>
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="initiative" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.listContainer}
              >
                <div className={styles.tableHeader}>
                  <span>Type</span>
                  <span>Name</span>
                  <span>Initiative</span>
                </div>

                {editedItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          ${styles.listItem} 
                          ${styles[item.type]} 
                          ${snapshot.isDragging ? styles.dragging : ''}
                        `}
                      >
                        {/* Drag Handle */}
                        <div
                          className={styles.dragHandle}
                          {...provided.dragHandleProps}
                        >
                          <FaGripVertical />
                        </div>

                        {isEditMode ? (
                          <>
                            <select
                              value={item.type}
                              onChange={(e) => handleEdit(item.id, 'type', e.target.value)}
                              className={styles.typeSelect}
                            >
                              <option value="player">Player</option>
                              <option value="enemy">Enemy</option>
                            </select>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleEdit(item.id, 'name', e.target.value)}
                              className={styles.nameInput}
                              placeholder="Enter name"
                            />
                            <input
                              type="number"
                              value={item.initiative}
                              onChange={(e) =>
                                handleEdit(item.id, 'initiative', e.target.valueAsNumber || '')
                              }
                              className={styles.initiativeInput}
                              placeholder="0"
                            />
                          </>
                        ) : (
                          <>
                            <span className={styles.typeBadge}>
                              {item.type === 'player' ? <FaUser /> : <FaDragon />}
                            </span>
                            <span className={styles.name}>{item.name || 'Unnamed'}</span>
                            <span className={styles.initiative}>{item.initiative}</span>
                          </>
                        )}
                        
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default InitiativeList;
