import { useState, useEffect } from "react";
import "./homePage.css";
import { SumCard } from "../summary/SumCard";
import { getAssetPath } from "~/utils/assets";
const URL = "https://cataas.com/cat?json=true";
const swipe_threshold = 100;

export function HomePage() {
  const [catImgCount, setCatImgCount] = useState<number>(20);
  const [catImg, setCatImg] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedImg, setLikedImg] = useState<string[]>([]);
  const [dislikedImg, setDislikedImg] = useState<string[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const isStackEmpty = catImg && currentIndex >= catImg.length;
  const [showSumPopup, setShowSumPopup] = useState(true);

  const handleSwipe = (direction: "left" | "right") => {
    console.log(direction === "right" ? "Liked" : "Disliked");
    setDragX(0);
    setIsDragging(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const startDrag = (x: number) => {
    setIsDragging(true);
    setStartX(x);
  };

  const endDrag = (finalDragX: number) => {
    if (finalDragX > swipe_threshold) {
      setDragX(window.innerWidth);
      setTimeout(() => handleSwipe("right"), 300);
      if (catImg) {
        setLikedImg((prev) => [...prev, catImg![currentIndex]]);
      }
      playFlipAud();
    } else if (finalDragX < -swipe_threshold) {
      setDragX(-window.innerWidth);
      setTimeout(() => handleSwipe("left"), 300);
      if (catImg) {
        setDislikedImg((prev) => [...prev, catImg![currentIndex]]);
      }
      playFlipAud();
    } else {
      setDragX(0);
    }

    setIsDragging(false);
  };

  // Pre-load image
  useEffect(() => {
    const imgs: string[] = [];
    const fetchCats = async () => {
      for (let i = 0; i < catImgCount; i++) {
        const res = await fetch(URL);
        const data = await res.json();
        console.log(`${data.url}`);
        imgs.push(`${data.url}`);
      }

      await Promise.all(
        imgs.map(
          (url) =>
            new Promise<void>((resolve, reject) => {
              const loadImg = new Image();
              loadImg.src = url;
              loadImg.onload = () => resolve();
            })
        )
      );

      setCatImg(imgs);
      setLoading(false);
    };
    fetchCats();
  }, [catImgCount]);

  const resetStack = (count: number) => {
    setLoading(true);
    setCatImg(null);
    setCurrentIndex(0);
    setLikedImg([]);
    setDislikedImg([]);
    setCatImgCount(count);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setDragX(clientX - startX);
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      endDrag(clientX - startX);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, startX]);

  const playFlipAud = () => {
    const cardFlip = new Audio(getAssetPath("Audio/cardFlip.mp3"));
    cardFlip.currentTime = 0;
    cardFlip.play();
  };

  return (
    <div className="min-h-screen w-full bg-purple-white center-flex">
      {!catImg ? (
        <div className="center-flex  flex-col gap-4">
          <img
            src={getAssetPath("Icons/oiia-cat.gif")}
            alt="Loading Cat"
            className="w-40 h-40 object-contain"
          />
          <div className="text-xl font-bold text-gray-700">
            Loading Cats....
          </div>
        </div>
      ) : isStackEmpty ? (
        (console.log("Reached empty stack - END"),
        (
          // Empty stack view
          <SumCard
            show={showSumPopup}
            likedImgSets={likedImg}
            dislikedImgSets={dislikedImg}
            cardCount={catImgCount}
            setCardCount={setCatImgCount}
            onReset={() => {
              resetStack(catImgCount);
            }}
          />
        ))
      ) : (
        <div className="relative w-100 h-170 bg-white rounded-2xl shadow-xl">
          {/* Card counter */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 
                bg-black bg-opacity-70 text-white 
                px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
          >
            {catImgCount - currentIndex}/{catImgCount}
          </div>
          {/* Image / top section */}
          <div
            className="relative w-full h-3/4 overflow-visible"
            style={{ touchAction: "pan-y" }}
          >
            {catImg?.slice(currentIndex).map((img, index) => {
              const isTop = index === 0;

              return (
                <div
                  key={currentIndex + index}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-xl bg-white"
                  style={{
                    transform: isTop
                      ? `translateX(${dragX}px) rotate(${dragX / 20}deg)`
                      : `scale(${1 - index * 0.02}) translateY(${index * 8}px)`,
                    zIndex: catImgCount - index,
                    cursor: isTop ? "grab" : "default",
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                  }}
                  onMouseDown={(e) => isTop && startDrag(e.clientX)}
                  onTouchStart={(e) => isTop && startDrag(e.touches[0].clientX)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <ImageCard img={img} />
                </div>
              );
            })}
          </div>

          {/* Swipe interface */}
          <div className="h-1/4 flex">
            {/* Left */}
            <div className="w-1/2 flex-col center-flex border-r border-gray-200">
              <img
                src={getAssetPath("Icons/swipe-left.gif")}
                alt="Swipe Left"
                className="w-12 h-15 object-contain"
              />
              <span className="text-red-500 font-bold mt-1">Dislike</span>
            </div>

            {/* Right */}
            <div className="w-1/2 flex-col center-flex">
              <img
                src={getAssetPath("Icons/swipe-right.gif")}
                alt="Swipe Right"
                className="w-12 h-15 object-contain"
              />
              <span className="text-green-500 font-bold mt-1">Like</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageCard({ img }: { img: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div className="w-full h-full">
        <img
          src={img}
          alt="Cat"
          className="w-full h-full object-cover rounded-2xl"
          draggable={false}
        />

        {/* Full view icon */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-2 right-2 p-2 bg-transparent rounded-full shadow-md hover:bg-[#202020]  cursor-zoom-out "
        >
          <img
            src={getAssetPath("Icons/fullScreen.png")}
            alt="Full Screen"
            className="w-6 h-6 rounded-full"
          />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={img}
            alt="Full View"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
          {/* Optional close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
