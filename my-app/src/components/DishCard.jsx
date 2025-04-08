// src/components/DishCard.js
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DishCard = ({ dish }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!user) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    const order = {
      userId: user.id,
      items: [dish],
      status: "in progress",
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Ошибка создания заказа");

      navigate("/orders");
    } catch (err) {
      alert("Произошла ошибка при создании заказа");
      console.error(err);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h4>{dish.name}</h4>
      <p>Цена: ${dish.price}</p>
      {user?.role === "Customer" && (
  <button onClick={handleOrder}>Оформить заказ</button>
)}
    </div>
  );
};

export default DishCard;
