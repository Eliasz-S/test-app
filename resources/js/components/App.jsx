import React, { useState, useMemo, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import axios from "axios";

const App = () => {
    // стейт с товарными позициями
    const [items, setItems] = useState([]);
    const [newGoodsData, setNewGoodsData] = useState({
        name: "",
        amount: "",
    });

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
            .catch((e) => console.log(e.response.data.message));
    };

    // отправка обновленных данных на сервер
    const updateGoodsData = async (item, updatedItems) => {
        await axios
            .put(`api/goods/${item.id}`, item)
            .then((response) => {
                console.log(response.data);
                setItems(updatedItems);
            })
            .catch((e) => {
                alert(e.response.data.message);
            });
    };

    const createItem = async (e) => {
        e.preventDefault();

        await axios
            .post("api/goods", newGoodsData)
            .then((response) => {
                console.log(response.data);
                fetchGoodsData();
                setNewGoodsData({
                    name: "",
                    amount: "",
                });
            })
            .catch((e) => alert(e.response.data.message));
    };

    // выбор позиции, количество которой хотим изменить
    const selectItem = (id, updatedItems) => {
        const itemToUpdate = updatedItems.find((item) => item.id === id);
        updateGoodsData(itemToUpdate, updatedItems);
    };

    // увеличение количества товара
    const increaseItemAmount = (id) => {
        const updatedGoodsData = items.map((item) =>
            item.id === id ? { ...item, amount: item.amount + 1 } : item
        );

        selectItem(id, updatedGoodsData);
    };

    // уменьшение количества товара
    const decreaseItemAmount = (id) => {
        const updatedGoodsData = items.map((item) =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item
        );
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
            <div className="main-border" />
            <div className="form__wrapper">
                <h3 className="header__main">
                    Создание новой товарной позиции
                </h3>
                <form>
                    <input
                        type="text"
                        placeholder="Название товара"
                        value={newGoodsData.name}
                        onChange={(e) =>
                            setNewGoodsData({
                                ...newGoodsData,
                                name: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Количество товара"
                        value={newGoodsData.amount}
                        onChange={(e) =>
                            setNewGoodsData({
                                ...newGoodsData,
                                amount: e.target.value,
                            })
                        }
                    />
                    <button onClick={createItem}>Создать товар</button>
                </form>
            </div>
        </div>
    );
};

export default App;
