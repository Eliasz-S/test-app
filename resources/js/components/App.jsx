import React, { useState, useMemo, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import axios from "axios";

const App = () => {
    // стейт с товарными позициями
    const [items, setItems] = useState([]);
    // стейт с изменямой товарной позицией - для изменения количества
    const [currentItem, setCurrentItem] = useState(null);

    // общее количество товаров - мемоизированное значение
    const totalItems = useMemo(() => {
        const sum = items.reduce((sum, current) => current.amount + sum, 0);
        return sum;
    }, [items]);

    // получение всех товаров из базы данных
    const fetchGoodsData = async () => {
        // в данном компоненте и фетч и аксиос - просто для теста пробовал разные варианты, сперва использовал только фетч
        const response = await fetch("api/goods");
        const data = await response.json();
        setItems([...data]);
    };

    // выбор позиции, количество которой хотим изменить
    const selectItem = (id) => {
        const item = items.find((item) => item.id === id);
        setCurrentItem(() => item);
    };

    // увеличение количества товара
    const increaseItemAmount = (id) => {
        if (totalItems < 10) {
            const newData = items.map((item) =>
                item.id === id ? { ...item, amount: item.amount + 1 } : item
            );

            setItems(() => [...newData]);
            selectItem(id);
        } else {
            alert("Достигнут лимит товаров на складе");
        }
    };

    // уменьшение количества товара
    const decreaseItemAmount = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, amount: item.amount - 1 } : item
            )
        );
        selectItem(id);
    };

    // при монтировании получаем данные с сервера
    useEffect(() => {
        fetchGoodsData();
    }, []);

    // попытка отследить изменения в items - не вышло
    useEffect(() => {
        const updateItem = async (item) => {
            if (currentItem) {
                await axios.put(`api/goods/${item.id}`, item);
            }
        };

        updateItem(currentItem);
    }, [items]);

    return (
        <div>
            <h1 className="header__main">Учет товарных позиций</h1>
            <div className="item__wrapper">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        amount={item.amount}
                        increaseAmount={increaseItemAmount}
                        decreaseAmount={decreaseItemAmount}
                    />
                ))}
            </div>
            <div className="total">
                <h3 className="total__header">
                    Всего товаров на складе: {totalItems}
                </h3>
            </div>
        </div>
    );
};

export default App;
