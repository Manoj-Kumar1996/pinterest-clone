import React, { useEffect } from "react";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import { PinCard } from "../components/PinCard";
import Masonry from "react-masonry-css"; // Import Masonry layout

const Home = () => {
  const { pins, loading, fetchPins } = PinData();

  useEffect(() => {
    fetchPins();
  }, []);

  // Masonry breakpoints for responsive columns
  const breakpointColumnsObj = {
    default: 5, // 4 columns for large screens
    1100: 3,    // 3 columns for medium screens
    700: 2,     // 2 columns for small screens
    500: 1      // 1 column for extra small screens
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Use Masonry component for Pinterest-style layout */}
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {pins.map((pin) => (
                <PinCard key={pin._id} pin={pin} />
              ))}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
