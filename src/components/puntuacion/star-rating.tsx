import React from 'react';
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";



interface StarRatingProps {
    currentRating: number;
    onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ currentRating, onRatingChange }) => {
    return (
        <div className='flex'>
            {[1, 2, 3, 4, 5].map((star) => (
                <>
                    <FaStar
                        key={star}
                        className={star <= currentRating ? "text-yellow-500" : "hidden"}
                        onClick={() => onRatingChange(star)}
                    />
                    <FaRegStar
                        key={star}
                        className={star <= currentRating ? "hidden" : "text-yellow-500" }
                        onClick={() => onRatingChange(star)}
                    />
                </>
            ))}
        </div>
    );
};

export default StarRating;
