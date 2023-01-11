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
    <div key={id} className="shadow  max-w-md  rounded">
      <picture>
        <img src={imageUrl} alt="" />
      </picture>
      <div className="p-5 flex flex-col space-y-2">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default Card;
