import { useState } from "react";
import { getAssetPath } from "~/utils/assets";

interface SumCardProps {
  show: boolean;
  cardCount: number;
  likedImgSets: string[];
  dislikedImgSets: string[];
  setCardCount: (val: number) => void;
  onReset: () => void;
}

export function SumCard({
  show,
  cardCount,
  likedImgSets,
  dislikedImgSets,
  setCardCount,
  onReset,
}: SumCardProps) {
  const [galleryOpen, setGalleryOpen] = useState<"liked" | "disliked" | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesToShow =
    galleryOpen === "liked"
      ? likedImgSets
      : galleryOpen === "disliked"
        ? dislikedImgSets
        : [];
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === imagesToShow.length - 1;

  const nextImage = () => {
    if (imagesToShow.length > 0)
      setCurrentIndex((prev) => (prev + 1) % imagesToShow.length);
  };

  const prevImage = () => {
    if (imagesToShow.length > 0)
      setCurrentIndex(
        (prev) => (prev - 1 + imagesToShow.length) % imagesToShow.length
      );
  };

  const openGallery = (type: "liked" | "disliked") => {
    setGalleryOpen(type);
    setCurrentIndex(0);
  };

  const closeGallery = () => setGalleryOpen(null);

  return (
    <>
      {/* Summary Card */}
      <div className="fixed flex flex-col items-center justify-center bg-white rounded-lg p-6  gap-6 w-80">
        <p className="text-3xl font-bold text-gray-800">No more cats!</p>
        <p className="text-xl text-gray-800">Here’s the summary</p>
        {/* Liked/Disliked Boxes */}
        <div className="w-full flex justify-around gap-4 text-sm font-semibold text-gray-700">
          <div
            className="relative group flex flex-col items-center bg-red-50 rounded-lg p-3 w-28 shadow-sm cursor-pointer"
            onClick={() => openGallery("disliked")}
          >
            <div
              className="absolute -top-8 opacity-0 group-hover:opacity-100 transition
             bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            >
              Click me!
            </div>
            <span className="text-red-500 text-xl font-bold">
              {dislikedImgSets.length}
            </span>
            <img
              src={getAssetPath("Icons/dislike.png")}
              alt="Disliked"
              className="w-10 h-10 object-contain my-1"
            />
            <span className="text-red-600">Disliked</span>
          </div>

          <div
            className="relative group flex flex-col items-center bg-green-50 rounded-lg p-3 w-28 shadow-sm cursor-pointer"
            onClick={() => openGallery("liked")}
          >
            <div
              className="absolute -top-8 opacity-0 group-hover:opacity-100 transition
             bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            >
              Click me!
            </div>
            <span className="text-green-600 text-xl font-bold">
              {likedImgSets.length}
            </span>
            <img
              src={getAssetPath("Icons/like.png")}
              alt="Liked"
              className="w-10 h-10 object-contain my-1"
            />
            <span className="text-green-600">Liked</span>
          </div>
        </div>

        {/* Card Count Selector */}
        <div className="flex flex-col items-center gap-2 w-full">
          <label className="text-gray-700 font-semibold">
            Select number of cats:
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-40 text-gray-700 cursor-pointer"
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          className="px-4 py-2 w-full bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer font-bold"
          onClick={onReset}
        >
          Try Again
        </button>
      </div>

      {/* Full-Screen Gallery */}
      {galleryOpen && imagesToShow.length > 0 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Image Container */}
          <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Image */}
            <img
              src={imagesToShow[currentIndex]}
              alt={`Image ${currentIndex}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Prev Button */}
            <button
              onClick={prevImage}
              disabled={isPrevDisabled}
              className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2
    ${
      isPrevDisabled
        ? "hover:bg-gray-300/60 cursor-not-allowed"
        : "hover:bg-gray-300/60  cursor-pointer"
    }`}
            >
              <img
                src={getAssetPath("Icons/previousBtn.png")}
                alt="Disliked"
                className="w-10 h-10 object-contain my-1"
              />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              disabled={isNextDisabled}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2
    ${
      isNextDisabled
        ? "hover:bg-gray-300/60 cursor-not-allowed"
        : "hover:bg-gray-300/60 cursor-pointer"
    }`}
            >
              <img
                src={getAssetPath("Icons/nextBtn.png")}
                alt="Disliked"
                className="w-10 h-10 object-contain my-1"
              />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-black text-5xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
