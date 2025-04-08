// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import restaurantReducer from "./restaurantSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";
import dishReducer from "./dishSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    orders: orderReducer,
    users: userReducer,
    dishes: dishReducer,
  },
});

export default store;
