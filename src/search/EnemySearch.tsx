import React, { ChangeEvent, useEffect, useState } from "react";

import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import styles from "./EnemySearch.module.scss";
import { dangerLevelStyle } from "../enemy/Enemy";
import {
  EnemySearchRequest,
  getEnemyAsync,
  getEnemyListAsync,
} from "../redux/thunx";
import { ApiEnemy } from "../models/enemy";
import { selectApiEnemies } from "../redux/slice/enemies.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

type EnemySearchProps = {
  onEnemySelected: () => void;
};
const EnemySearch = ({ onEnemySelected }: EnemySearchProps) => {
  const { t } = useTranslation("common");
  // Use the custom typed dispatch to accept thunk actions.
  const dispatch = useAppDispatch();
  // Selector to retrieve the filtered enemy list from the store.
  const filtered = useAppSelector(selectApiEnemies);

  const [searchTerm, setSearchTerm] = useState("");
  // dangerFilter remains a string; if empty, it won't be sent to the API.
  const [dangerFilter, setDangerFilter] = useState("");
  // Explicitly type dangerSort as "asc" or "desc"
  const [dangerSort, setDangerSort] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    // Optionally, clear search results if both searchTerm and dangerFilter are empty.
    if (!term && !dangerFilter) {
      return;
    }
    // Dispatch the search thunk. Note: if dangerFilter is empty, we send undefined.
    const request: EnemySearchRequest = {
      query: term,
      danger: dangerFilter || undefined,
      sort: dangerSort,
    };
    dispatch(getEnemyListAsync(request));
  }, [searchTerm, dangerFilter, dangerSort, dispatch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDangerFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDangerFilter(e.target.value);
  };

  const handleDangerSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Ensure the sort value is lower-case "asc" or "desc"
    setDangerSort(e.target.value.toLowerCase() as "asc" | "desc");
  };

  const handleSelectEnemy = async (selected: ApiEnemy) => {
    dispatch(getEnemyAsync(selected.link));
    onEnemySelected();
  };

  // Determine the sort icon based on the current dangerSort value.
  const sortIcon = dangerSort === "asc" ? <FaArrowDown /> : <FaArrowUp />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("app.enemy-search.add-enemy")}</h2>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder={t("app.enemy-search.search-enemy-placeholder")}
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select
          value={dangerFilter}
          onChange={handleDangerFilterChange}
          className={styles.selectInput}
        >
          <option value="">{t("app.enemy-search.all-danger-levels")}</option>
          <option value="0">0</option>
          <option value="0-1">&lt; 1</option>
          <option value="1-5">1-5</option>
          <option value="6-10">6-10</option>
          <option value="11-15">11-15</option>
          <option value="16-20">16-20</option>
          <option value="greater20">
            {t("app.enemy-search.danger-greater-than-20")}
          </option>
        </select>
        <select
          value={dangerSort}
          onChange={handleDangerSortChange}
          className={styles.selectInput}
        >
          <option value="asc">
            {t("app.enemy-search.danger-asc")} {sortIcon}
          </option>
          <option value="desc">
            {t("app.enemy-search.danger-desc")} {sortIcon}
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
