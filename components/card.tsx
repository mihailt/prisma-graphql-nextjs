import React from 'react';

export type CardProps = {
  id: string
  imageUrl: string
  title: string
  description: string
}

function Card({
  id,
  imageUrl,
  title,
  description,
}: CardProps) {
  return (
    <div key={id} className="max-w-sm rounded overflow-hidden shadow-lg">
      <div>
        <img className="object-cover h-48 w-full max-w-full max-h-fit" src={imageUrl} alt="Sunset in the mountains" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}

export default Card;
