import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { keywordData } from '../public/data.js';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Filters({
  categoryFilters,
  setCategoryFilters,
  searchVolumeFilter,
  setSearchVolumeFilter,
  questionFilter,
  setQuestionFilter,
  keywordFilter,
  setKeywordFilter,
  showCompetitors,
  setShowCompetitors,
  selectedCompetitors,
  setSelectedCompetitors,
  rankRange,
  setRankRange
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const categories = useMemo(() => [...new Set(keywordData.map(item => item.category))], []);
  
  const categoryOptions = useMemo(() => 
    categories.map(category => ({ value: category, label: category }))
  , [categories]);

  const competitors = useMemo(() => {
    const allCompetitors = new Set();
    keywordData.forEach(item => {
      item.competitors.forEach(comp => {
        allCompetitors.add(comp.name);
      });
    });
    return Array.from(allCompetitors);
  }, []);

  const competitorOptions = useMemo(() => 
    competitors.map(comp => ({ value: comp, label: comp }))
  , [competitors]);

  const handleCategoryChange = (selectedOptions) => {
    setCategoryFilters(selectedOptions.map(option => option.value));
  };

  const handleCompetitorChange = (selectedOptions) => {
    setSelectedCompetitors(selectedOptions.map(option => option.value));
  };

  const handleRankRangeChange = (type, value) => {
    const newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 100) return;

    if (type === 'min') {
      setRankRange([newValue, Math.max(newValue, rankRange[1])]);
    } else {
      setRankRange([Math.min(rankRange[0], newValue), newValue]);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        className="w-full bg-purple-700 text-white py-2 px-4 rounded-t-lg flex justify-between items-center"
      >
        <span>Filters</span>
        {isFiltersVisible ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isFiltersVisible && (
        <div className="bg-white p-6 border-2 border-black rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
              <Select
                isMulti
                options={categoryOptions}
                value={categoryFilters.map(cat => ({ value: cat, label: cat }))}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label htmlFor="search-volume-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Search Volume
              </label>
              <input
                id="search-volume-filter"
                type="number"
                value={searchVolumeFilter}
                onChange={(e) => setSearchVolumeFilter(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="keyword-filter" className="block text-sm font-medium text-gray-700 mb-1">Keyword Filter</label>
              <input
                id="keyword-filter"
                type="text"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="e.g., shampoo, soap"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showCompetitors}
                  onChange={(e) => setShowCompetitors(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">Show Competitors</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={questionFilter}
                  onChange={(e) => setQuestionFilter(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">Questions Only</span>
              </label>
            </div>
            {showCompetitors && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Rank Range:</label>
                <input
                  type="number"
                  value={rankRange[0]}
                  onChange={(e) => handleRankRangeChange('min', e.target.value)}
                  className="w-16 p-1 border border-gray-300 rounded-md"
                  min="1"
                  max="100"
                />
                <span>-</span>
                <input
                  type="number"
                  value={rankRange[1]}
                  onChange={(e) => handleRankRangeChange('max', e.target.value)}
                  className="w-16 p-1 border border-gray-300 rounded-md"
                  min="1"
                  max="100"
                />
              </div>
            )}
          </div>
          {showCompetitors && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Competitors</label>
              <Select
                isMulti
                options={competitorOptions}
                value={selectedCompetitors.map(comp => ({ value: comp, label: comp }))}
                onChange={handleCompetitorChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}