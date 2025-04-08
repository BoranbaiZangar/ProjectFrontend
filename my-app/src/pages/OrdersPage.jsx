// src/pages/OrdersPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orders, loading, error } = useSelector((state) => state.orders);
  const statuses = ["in progress", "confirmed", "delivered", "cancelled"];

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.role === "Admin" ? "ALL" : user.id));
    }
  }, [dispatch, user]);

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);
    const updatedOrder = { ...order, status: newStatus };

    await fetch(`http://localhost:5000/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    });

    dispatch(fetchOrders(user.role === "Admin" ? "ALL" : user.id));
  };

  if (loading) return <p>Загрузка заказов...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{user.role === "Admin" ? "Все заказы" : "Мои заказы"}</h2>
      {orders.length === 0 ? (
        <p>Нет заказов</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} style={{ marginBottom: "1rem" }}>
              <strong>Заказ #{order.id}</strong>
              {user.role === "Admin" && (
                <p>Клиент: User #{order.userId}</p>
              )}
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} — ${item.price}
                  </li>
                ))}
              </ul>
              {user.role === "Admin" ? (
                <>
                  <label>Статус: </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <p>Статус: <strong>{order.status}</strong></p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
