import React, { useMemo } from 'react';
import Select from 'react-select';
import { keywordData } from '../public/data.js';

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
    <div className="bg-gray-100 rounded-lg p-6 mb-10 shadow-md transition-all duration-300 ease-in-out border-2 border-black">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2 pb-4">
          <label className="block text-sm font-bold text-gray-700">Categories</label>
          <Select
            isMulti
            options={categoryOptions}
            value={categoryFilters.map(cat => ({ value: cat, label: cat }))}
            onChange={handleCategoryChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="space-y-2 pb-4">
          <label htmlFor="search-volume-filter" className="block text-sm font-bold text-gray-700">Minimum Search Volume</label>
          <input
            id="search-volume-filter"
            type="number"
            value={searchVolumeFilter}
            onChange={(e) => setSearchVolumeFilter(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
            min="0"
          />
        </div>

        <div className="space-y-2 pb-4">
          <label htmlFor="keyword-filter" className="block text-sm font-bold text-gray-700">Keyword Filter</label>
          <input
            id="keyword-filter"
            type="text"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
            placeholder="e.g., shampoo, soap"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
        </div>

        <div className="flex justify-between items-center space-x-4 pb-4">
          <div className="flex items-center space-x-2">
            <input
              id="show-competitors"
              type="checkbox"
              checked={showCompetitors}
              onChange={(e) => setShowCompetitors(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="show-competitors" className="text-sm font-bold text-gray-700">Show Competitors</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="questions-only"
              type="checkbox"
              checked={questionFilter}
              onChange={(e) => setQuestionFilter(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="questions-only" className="text-sm font-bold text-gray-700">Questions Only</label>
          </div>
        </div>

        {showCompetitors && (
          <>
            <div className="space-y-2 pb-4">
              <label className="block text-sm font-bold text-gray-700">Select Competitors</label>
              <Select
                isMulti
                options={competitorOptions}
                value={selectedCompetitors.map(comp => ({ value: comp, label: comp }))}
                onChange={handleCompetitorChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <div className="space-y-2 col-span-2 pb-4">
              <label className="block text-sm font-bold text-gray-700">Rank Range</label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="min-rank" className="block text-xs font-medium text-gray-500">Min</label>
                  <input
                    id="min-rank"
                    type="number"
                    value={rankRange[0]}
                    onChange={(e) => handleRankRangeChange('min', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max-rank" className="block text-xs font-medium text-gray-500">Max</label>
                  <input
                    id="max-rank"
                    type="number"
                    value={rankRange[1]}
                    onChange={(e) => handleRankRangeChange('max', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}