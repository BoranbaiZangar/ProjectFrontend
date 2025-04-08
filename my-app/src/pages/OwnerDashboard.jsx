// src/pages/OwnerDashboard.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [newDish, setNewDish] = useState({ name: "", price: "" });

  // Загружаем ресторан владельца
  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await fetch(`http://localhost:5000/restaurants?ownerId=${user.id}`);
      const data = await res.json();
      if (data.length > 0) {
        setRestaurant(data[0]);
        setForm({ name: data[0].name, description: data[0].description });
      }
    };
    fetchRestaurant();
  }, [user]);

  // Обработка создания или обновления ресторана
  const handleSubmit = async (e) => {
    e.preventDefault();
    const restaurantData = {
      ...restaurant,
      ownerId: user.id,
      name: form.name,
      description: form.description,
      dishes: restaurant?.dishes || [],
    };

    const url = restaurant
      ? `http://localhost:5000/restaurants/${restaurant.id}`
      : "http://localhost:5000/restaurants";
    const method = restaurant ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantData),
    });

    const updated = await res.json();
    setRestaurant(updated);
  };

  // Добавить блюдо
  const handleAddDish = async () => {
    if (!newDish.name || !newDish.price) return;

    const updatedDishes = [
      ...(restaurant.dishes || []),
      {
        id: Date.now(),
        name: newDish.name,
        price: parseFloat(newDish.price),
      },
    ];

    const updatedRestaurant = { ...restaurant, dishes: updatedDishes };

    await fetch(`http://localhost:5000/restaurants/${restaurant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRestaurant),
    });

    setRestaurant(updatedRestaurant);
    setNewDish({ name: "", price: "" });
  };

  // Удалить блюдо
  const handleDeleteDish = async (dishId) => {
    const updatedDishes = restaurant.dishes.filter((d) => d.id !== dishId);
    const updatedRestaurant = { ...restaurant, dishes: updatedDishes };

    await fetch(`http://localhost:5000/restaurants/${restaurant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRestaurant),
    });

    setRestaurant(updatedRestaurant);
  };

  return (
    <div>
      <h2>Панель владельца ресторана</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Название ресторана"
          required
        />
        <br />
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Описание"
          required
        />
        <br />
        <button type="submit">
          {restaurant ? "Сохранить" : "Создать ресторан"}
        </button>
      </form>

      {restaurant && (
        <>
          <h3>Блюда</h3>
          <ul>
            {restaurant.dishes?.map((dish) => (
              <li key={dish.id}>
                {dish.name} — ${dish.price}
                <button onClick={() => handleDeleteDish(dish.id)} style={{ marginLeft: 10 }}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>

          <h4>Добавить блюдо</h4>
          <input
            placeholder="Название"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Цена"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
          />
          <button onClick={handleAddDish}>Добавить</button>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
