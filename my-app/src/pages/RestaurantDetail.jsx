import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRestaurantById, clearSelected } from "../redux/restaurantSlice";
import DishCard from "../components/DishCard";

const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: restaurant, loading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));

    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!restaurant) return <p>Ресторан не найден</p>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description}</p>

      <h3>Меню</h3>
      {restaurant.dishes && restaurant.dishes.length > 0 ? (
        <div>
          {restaurant.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <p>В этом ресторане пока нет блюд.</p>
      )}
    </div>
  );
};

export default RestaurantDetail;
