'use client'

import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

export default function CategoryCarousel({ categories }) {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {categories.map((category) => (
                    <CarouselItem
                        key={category.id}
                        className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                <h3 className="text-lg font-semibold text-white text-center px-4">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
