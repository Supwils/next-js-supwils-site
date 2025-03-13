import { useState, useEffect } from 'react';
import styles from './searchBar.module.css';

const tags = ["All", "Tech","Life"];

const SearchBar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedTags, setSelectedTags] = useState(["All"]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // Handle tag selection
    const handleTagClick = (tag) => {
        setSelectedTags((prev) => {
            if (tag === "All") return ["All"];
            if (prev.includes(tag)) {
                const newTags = prev.filter((t) => t !== tag);
                return newTags.length === 0 ? ["All"] : newTags; // Ensure at least "All" remains
            } else {
                return prev.includes("All") ? [tag] : [...prev, tag];
            }
        });
    };

    // 🔥 Use useEffect to call onSearch when searchText or selectedTags change
    useEffect(() => {
        onSearch(searchText, selectedTags);
    }, [searchText, selectedTags, onSearch]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search projects..."
                className={styles.searchBar}
                value={searchText}
                onChange={handleSearchChange}
            />

            <div>
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className={`${styles.categoryBox} ${selectedTags.includes(tag) ? styles.active : ''}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;