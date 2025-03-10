import React, { useState } from 'react';
import './style/FilterToDate.css'

interface FilterToDateProps {
    onFilter: (start: string | null, end: string | null) => void;
}

const FilterToDate: React.FC<FilterToDateProps> = ({ onFilter }) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFilter(startDate, endDate);
    };

    const handleClearFilter = () => {
        setStartDate(null);
        setEndDate(null);
        onFilter(null, null);
    };

    return (
        <div className="filter-section">
            <h2 className="filter-title">Фильтр по датам</h2>
            <form className="filter-form" onSubmit={handleSubmit}>
                <label className="filter-label" htmlFor="startDate">Начальная дата:</label>
                <input
                    className="filter-input"
                    type="date"
                    id="startDate"
                    value={startDate || ''}
                    onChange={e => setStartDate(e.target.value)}
                />

                <label className="filter-label" htmlFor="endDate">Конечная дата:</label>
                <input
                    className="filter-input"
                    type="date"
                    id="endDate"
                    value={endDate || ''}
                    onChange={e => setEndDate(e.target.value)}
                />

                <button className="filter-button" type="submit">Применить фильтр</button>
                <button
                    className="filter-button clear-button"
                    type="button"
                    onClick={handleClearFilter}
                >
                    Сбросить фильтр
                </button>
            </form>
        </div>
    );
};

export default FilterToDate;