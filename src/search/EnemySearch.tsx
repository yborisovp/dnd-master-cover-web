import React, { useEffect, useState, ChangeEvent } from 'react';
import ky from 'ky';
import { FaArrowUp, FaArrowDown, FaBars } from 'react-icons/fa';
import styles from './EnemySearch.module.scss';
import { dangerLevelStyle, EnemyData } from '../Cards/Enemy';

interface ApiEnemy {
  name: string;
  danger: number;
  link: string;
}

interface EnemySearchProps {
  onAddEnemy: (newEnemy: EnemyData, enemyLink: string) => void;
}

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:28809";

const EnemySearch: React.FC<EnemySearchProps> = ({ onAddEnemy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dangerFilter, setDangerFilter] = useState('');
  const [dangerSort, setDangerSort] = useState('asc'); // 'asc' or 'desc'
  const [filtered, setFiltered] = useState<ApiEnemy[]>([]);

  // Query API whenever searchTerm, dangerFilter, or dangerSort changes
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term && !dangerFilter) {
      setFiltered([]);
      return;
    }
    
    (async () => {
      try {
        const params = new URLSearchParams({
          q: term,
          sort: dangerSort,
        });
        if (dangerFilter) {
          params.append('dangerLevel', dangerFilter);
        }
        const data = await ky
          .get(`${apiUrl}/enemy/search?${params.toString()}`)
          .json<ApiEnemy[]>();
        setFiltered(data);
      } catch (error) {
        console.error('Error fetching enemies:', error);
      }
    })();
  }, [searchTerm, dangerFilter, dangerSort]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDangerFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDangerFilter(e.target.value);
    console.log("Selected Danger Filter:", e.target.value);
  };

  const handleDangerSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDangerSort(e.target.value);
    console.log("Selected Danger Sort:", e.target.value);
  };

  const handleSelectEnemy = async (selected: ApiEnemy) => {
    try {
      const params = new URLSearchParams({
        link: selected.link,
      });
      const data = await ky
        .get(`${apiUrl}/enemy?${params.toString()}`)
        .json<EnemyData>();
      onAddEnemy(data, `https://dnd.su/bestiary/${selected.link}`);
    } catch (error) {
      console.error('Error fetching detailed enemy data:', error);
    }
  };

  // Determine sort icon based on dangerSort value
  const sortIcon =
    dangerSort === 'asc' ? <FaArrowDown /> : dangerSort === 'desc' ? <FaArrowUp /> : <FaBars />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Enemy</h2>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search for an enemy..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select
          value={dangerFilter}
          onChange={handleDangerFilterChange}
          className={styles.selectInput}
        >
          <option value="">All Danger Levels</option>
          <option value="0">0</option>
          <option value="0-1">{"<"} 1</option>
          <option value="1-5">1-5</option>
          <option value="6-10">6-10</option>
          <option value="11-15">11-15</option>
          <option value="16-20">16-20</option>
          <option value="greater20">Greater than 20</option>
        </select>
        <select
          value={dangerSort}
          onChange={handleDangerSortChange}
          className={styles.selectInput}
        >
          <option value="Asc">
            Danger Ascending {sortIcon}
          </option>
          <option value="Desc">
            Danger Descending {sortIcon}
          </option>
        </select>
      </div>
      <ul className={styles.resultsList}>
        {filtered.map((item) => (
          <li
            key={item.link}
            className={styles.resultItem}
            onClick={() => handleSelectEnemy(item)}
          >
            <span className={styles.enemyName}>{item.name}</span>
            <span
              className={`${styles.dangerLevel} ${
                styles[`dangerLevel--${dangerLevelStyle(item.danger)}`]
              }`}
            >
              {item.danger}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnemySearch;
