import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const ItemCard = ({
    id,
    name,
    amount,
    increaseAmount,
    decreaseAmount,
}) => {
    return (
        <div className="item-card">
            <div>{name}</div>
            <div className="item-card__amount">
                Кол-во: &nbsp;
                {amount > 0 && (
                    <FontAwesomeIcon
                        className="item-card__icon"
                        icon="fa-solid fa-circle-minus"
                        onClick={() => decreaseAmount(id)}
                    />
                )}
                &nbsp;
                {amount}
                &nbsp;
                <FontAwesomeIcon
                    className="item-card__icon"
                    icon="fa-solid fa-circle-plus"
                    onClick={() => increaseAmount(id)}
                />
            </div>
        </div>
    );
};
