"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";

interface Stock {
  Name: string;
  ISIN: string;
  date: string;
}

const ITEMS_PER_PAGE = 50;

const StockColumn = ({ title, stocks, type }: { title: string; stocks: Stock[]; type: "added" | "removed" }) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-2xl font-bold mb-4">{title} ({stocks.length})</h2>
      <div className="space-y-2">
        {stocks.slice(0, visibleCount).map((stock) => (
          <StockCard key={stock.ISIN} stock={stock} type={type} />
        ))}
      </div>
      {visibleCount < stocks.length && (
        <button
          onClick={loadMore}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
}

const StockLists = () => {
  const [addedStocks, setAddedStocks] = useState<Stock[]>([]);
  const [removedStocks, setRemovedStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const GITHUB_REPO = "nadelritter/database-republic";
        const BRANCH = "master";
        
        // Corrected lines with backticks ``
        const addedRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}/data/added.json`);
        const removedRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}/data/removed.json`);
        
        const addedData = await addedRes.json();
        const removedData = await removedRes.json();
        
        setAddedStocks(addedData);
        setRemovedStocks(removedData);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading stock data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Added and Removed Stocks from TradeRepublic
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <StockColumn title="? Added Stocks" stocks={addedStocks} type="added" />
        <StockColumn title="? Removed Stocks" stocks={removedStocks} type="removed" />
      </div>
    </div>
  );
};

export default StockLists;
