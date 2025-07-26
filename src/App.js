// src/App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";

import MenuUtama from "./Pages/MenuUtama";
import MenuProduk from "./Pages/MenuProduk";
import MenuKontak from "./Pages/MenuKontak";
import MenuTentangKami from "./Pages/MenuTentangKami";
import TrackingMap from './Pages/TrackingMap';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MenuUtama />
            </motion.div>
          }
        />
        <Route
          path="/produk"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MenuProduk />
            </motion.div>
          }
        />
        <Route
          path="/kontak"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MenuKontak />
            </motion.div>
          }
        />
        <Route
          path="/tentang"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MenuTentangKami />
            </motion.div>
          }
        />
        <Route
          path="/tracking"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TrackingMap />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <>
    <Header />
    <div style={{ padding: "20px" }}>
      <AnimatedRoutes />
    </div>
    <Footer />
  </>
);
<Route path="/tracking" element={<TrackingMap />} />
export default App;
