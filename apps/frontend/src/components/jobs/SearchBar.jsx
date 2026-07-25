export default function SearchBar({
  filters,
  setFilters,
  onSearch,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <input
        placeholder="Keyword"
        value={filters.keyword}
        onChange={(e) =>
          setFilters({
            ...filters,
            keyword: e.target.value,
          })
        }
      />

      <input
        placeholder="Company"
        value={filters.company}
        onChange={(e) =>
          setFilters({
            ...filters,
            company: e.target.value,
          })
        }
      />

      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) =>
          setFilters({
            ...filters,
            location: e.target.value,
          })
        }
      />

      <select
        value={filters.employmentType}
        onChange={(e) =>
          setFilters({
            ...filters,
            employmentType: e.target.value,
          })
        }
      >
        <option value="">All</option>
        <option>Full-time</option>
        <option>Internship</option>
        <option>Part-time</option>
        <option>Contract</option>
      </select>

      <button onClick={onSearch}>
        Search
      </button>
    </div>
  );
}