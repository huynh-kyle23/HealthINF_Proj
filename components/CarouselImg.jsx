import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";

function StudyEnvironmentCarousel() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Images for the carousel
  const carouselImages = [
    { src: "/CafeImg.png", alt: "Cafe Environment" },
    { src: "/libraryImg.jpg", alt: "Library Environment" },
    { src: "/rainfall.jpg", alt: "Rainfall Environment" },
    { src: "/beachImg.jpg", alt: "Beach Environment" },
  ];

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-md">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 shadow-none">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-xl"
                    // Fallback if images don't exist
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/500/500";
                    }}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Environment {current} of {count}
      </div>
    </div>
  );
}

export default StudyEnvironmentCarousel;
