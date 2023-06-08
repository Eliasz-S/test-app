import React, { useState, useMemo, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import axios from "axios";

const App = () => {
    // стейт с товарными позициями
    const [items, setItems] = useState([]);

    // общее количество товаров - мемоизированное значение
    const totalItems = useMemo(() => {
        const sum = items.reduce((sum, current) => current.amount + sum, 0);
        return sum;
    }, [items]);

    // получение всех товаров из базы данных
    const fetchGoodsData = async () => {
        await axios("api/goods")
            .then((response) => {
                setItems([...response.data]);
            })
            .catch((e) => console.log(e.message));
    };

    // отправка обновленных данных на сервер
    const updateGoodsData = async (item) => {
        await axios
            .put(`api/goods/${item.id}`, item)
            .then((response) => console.log(response.data))
            .catch((e) => console.log(e.message));
    };

    // выбор позиции, количество которой хотим изменить
    const selectItem = (id, updatedItems) => {
        const itemToUpdate = updatedItems.find((item) => item.id === id);
        updateGoodsData(itemToUpdate);
    };

    // увеличение количества товара
    const increaseItemAmount = (id) => {
        if (totalItems < 10) {
            const updatedGoodsData = items.map((item) =>
                item.id === id ? { ...item, amount: item.amount + 1 } : item
            );

            setItems(() => [...updatedGoodsData]);
            selectItem(id, updatedGoodsData);
        } else {
            alert("Достигнут лимит товаров на складе");
        }
    };

    // уменьшение количества товара
    const decreaseItemAmount = (id) => {
        const updatedGoodsData = items.map((item) =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item
        );
        setItems(() => [...updatedGoodsData]);
        selectItem(id, updatedGoodsData);
    };

    // при монтировании получаем данные с сервера
    useEffect(() => {
        fetchGoodsData();
    }, []);

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
