"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface ImagePreviewDialogProps {
  images: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex: number;
}

const ImagePreviewDialog = ({
  images,
  open,
  onOpenChange,
  initialIndex,
}: ImagePreviewDialogProps) => {
  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-secondary">View Image</DialogTitle>
        </DialogHeader>

        <Swiper
          spaceBetween={10}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          initialSlide={initialIndex}
          className="w-full h-full justify-center items-center"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
