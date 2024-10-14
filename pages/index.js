import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { keywordData } from '../public/kay.js';
import Filters from '../components/Filters';
import KeywordTable from '../components/KeywordTable';
import CategoryAnalysis from '../components/CategoryAnalysis';
import BrandedAnalysis from '../components/BrandedAnalysis';
import CategoryDistribution from '../components/CategoryDistribution';
import CompetitorAnalysis from '../components/CompetitorAnalysis';
import Sidebar from '../components/Sidebar';

const ClientKeywordsAnalysis = () => {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [searchVolumeFilter, setSearchVolumeFilter] = useState(0);
  const [brandedFilter, setBrandedFilter] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [chartMetric, setChartMetric] = useState('searchVolume');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [rankRange, setRankRange] = useState([1, 10]);
  const [competitorDataType, setCompetitorDataType] = useState('count');
  const [selectedKeywords, setSelectedKeywords] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('keywordTable');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredData = useMemo(() => {
    return keywordData.filter(item => {
      const categoryMatch = categoryFilters.length === 0 || categoryFilters.includes(item.category);
      const volumeMatch = item.searchVolume >= searchVolumeFilter;
      const brandedMatch = !brandedFilter || item.isBranded;
      const keywordMatch = keywordFilter === '' || 
        keywordFilter.split(',').some(keyword => 
          item.keyword.toLowerCase().includes(keyword.trim().toLowerCase())
        );
      const competitorMatch = item.competitors.some(comp => 
        (selectedCompetitors.length === 0 || selectedCompetitors.includes(comp.name)) &&
        comp.rank >= rankRange[0] && comp.rank <= rankRange[1]
      );

      return categoryMatch && volumeMatch && brandedMatch && keywordMatch && competitorMatch;
    });
  }, [categoryFilters, searchVolumeFilter, brandedFilter, keywordFilter, selectedCompetitors, rankRange]);

  const handleKeywordSelect = useCallback((keyword) => {
    setSelectedKeywords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyword)) {
        newSet.delete(keyword);
      } else {
        newSet.add(keyword);
      }
      return newSet;
    });
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Kay's Gap Analysis Dashboard</title>
      </Head>
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeView={activeView} 
        setActiveView={setActiveView}
      />
      
      <div className="ml-0 transition-all duration-300 ease-in-out">
        <button 
          onClick={toggleSidebar} 
          className={`fixed left-5 z-50 bg-purple-700 text-white border-none rounded p-3 text-xl cursor-pointer transition-all duration-300 ease-in-out ${
            scrollPosition > 64 ? 'top-5' : 'top-20'
          }`}
        >
          ☰
        </button>

        <h1 className="text-4xl font-bold text-center text-purple-700 pb-5 mb-10 border-b-2 border-purple-700">Kay's Gap Analysis Dashboard</h1>
        
        <Filters
          categoryFilters={categoryFilters}
          setCategoryFilters={setCategoryFilters}
          searchVolumeFilter={searchVolumeFilter}
          setSearchVolumeFilter={setSearchVolumeFilter}
          brandedFilter={brandedFilter}
          setBrandedFilter={setBrandedFilter}
          keywordFilter={keywordFilter}
          setKeywordFilter={setKeywordFilter}
          showCompetitors={showCompetitors}
          setShowCompetitors={setShowCompetitors}
          selectedCompetitors={selectedCompetitors}
          setSelectedCompetitors={setSelectedCompetitors}
          rankRange={rankRange}
          setRankRange={setRankRange}
        />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">Select View</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('keywordTable')}
              className={`px-4 py-2 rounded ${activeView === 'keywordTable' ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
            >
              Keyword Table
            </button>
            <button
              onClick={() => setActiveView('categoryAnalysis')}
              className={`px-4 py-2 rounded ${activeView === 'categoryAnalysis' ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
            >
              Category Analysis
            </button>
            <button
              onClick={() => setActiveView('competitorAnalysis')}
              className={`px-4 py-2 rounded ${activeView === 'competitorAnalysis' ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
            >
              Competitor Analysis
            </button>
          </div>
        </div>

        {activeView === 'keywordTable' && (
          <KeywordTable
            filteredData={filteredData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            showCompetitors={showCompetitors}
            selectedKeywords={selectedKeywords}
            handleKeywordSelect={handleKeywordSelect}
          />
        )}

        {activeView === 'categoryAnalysis' && (
          <>
            <CategoryAnalysis
              filteredData={filteredData}
              chartMetric={chartMetric}
              setChartMetric={setChartMetric}
            />
            <BrandedAnalysis
              filteredData={filteredData}
              chartMetric={chartMetric}
            />
            <CategoryDistribution
              filteredData={filteredData}
              chartMetric={chartMetric}
            />
          </>
        )}

        {activeView === 'competitorAnalysis' && (
          <CompetitorAnalysis
            filteredData={filteredData}
            competitorDataType={competitorDataType}
            setCompetitorDataType={setCompetitorDataType}
          />
        )}
      </div>
    </div>
  );
};

export default ClientKeywordsAnalysis;