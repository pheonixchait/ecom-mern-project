import React from 'react'
import StarRating from "react-star-ratings"

//starClick is a prop and <> is fragment
const Star = ({ starClick, numberOfStars }) => (
    <>
        <StarRating
            changeRating={() => starClick(numberOfStars)}
            numberOfStars={numberOfStars}
            starDimension="20px"
            starSpacing="2px"
            starHoverColor="red"
            starEmptyColor="red"
        />
        <br />
    </>
);//take care of paranthesis if you are not writing return

export default Star