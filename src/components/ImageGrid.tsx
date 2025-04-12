"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ImagePreviewDialog from "./ImagePreviewDialog";


interface Props {
  images: string[];
}

const ImageGridWithDialog = ({ images }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const getGridClass = () => {
    switch (images.length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3 grid-rows-2";
      case 4: return "grid-cols-2";
      case 5: return "grid-cols-4 grid-rows-2";
      case 6: return "grid-cols-3 grid-rows-3";
      default: return "grid-cols-3";
    }
  };

  const getImageClass = (index: number) => {
    if ((images.length === 3 && index === 0) ||
      (images.length === 5 && index === 0) ||
      (images.length === 6 && index === 0)) {
      return "row-span-2 col-span-2";
    }
    return "";
  };

  return (
    <>
      <div className={`grid gap-4 ${getGridClass()}`}>
        {images.map((image, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`rounded-lg overflow-hidden cursor-pointer ${getImageClass(i)}`}
          >
            <img src={image} alt={`Post image ${i + 1}`} className="w-full h-full object-cover" style={{ aspectRatio: "1 / 1" }} />
          </div>
        ))}
      </div>

      <ImagePreviewDialog
        images={images}
        open={selectedIndex !== null}
        initialIndex={selectedIndex ?? 0}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      />
    </>
  );
};

export default ImageGridWithDialog;
