"use client"; // This component fetches data on the client

import { useEffect, useState } from "react";
import Link from "next/link";

// Define a type for our Reddit post data
interface RedditPost {
  id: string;
  title: string;
  permalink: string;
}

const RedditPostCard = ({ subreddit }: { subreddit: string }) => {
  const [post, setPost] = useState<RedditPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=1`
        );
        if (!response.ok) throw new Error("Failed to fetch from Reddit.");
        const data = await response.json();
        const firstPost = data.data.children[0]?.data;
        if (firstPost) {
          setPost({
            id: firstPost.id,
            title: firstPost.title,
            permalink: firstPost.permalink,
          });
        }
      } catch (err) {
        setError("Could not load post.");
        console.error(err);
      }
    };
    fetchPost();
  }, [subreddit]);

  return (
    <div className="bg-[#181818] p-4 rounded-lg border border-gray-700">
      <h3 className="font-bold text-gray-400 mb-2">r/{subreddit}</h3>
      {post && (
        <Link
          href={`https://www.reddit.com${post.permalink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-400"
        >
          {post.title}
        </Link>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!post && !error && <p className="text-gray-500 text-sm">Loading...</p>}
    </div>
  );
};

const RightSidebar = () => {
  return (
    <aside className="sticky top-0 h-screen w-80 flex-col space-y-6 border-l border-gray-700 bg-[#181818] p-6 hidden lg:flex">
      {/* SP500 Chart Placeholder */}
      <div className="bg-[#181818] p-4 rounded-lg border border-gray-700 h-48">
        <h3 className="font-bold text-gray-400 mb-2">S&P 500 (5Y)</h3>
        <div className="h-full flex items-center justify-center text-gray-500">
          [Chart Component Placeholder]
        </div>
      </div>
      
      {/* Reddit Posts */}
      <div className="space-y-4">
        <RedditPostCard subreddit="finanzen" />
        <RedditPostCard subreddit="mauerstrassenwetten" />
      </div>
    </aside>
  );
};

export default RightSidebar;