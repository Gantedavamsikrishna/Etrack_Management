import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Floor } from "./pages/Floor";
import { Hall } from "./pages/Hall";
import { Room } from "./pages/Room";
import { Inventory } from "./pages/Inventory";
import { BuildingMap } from "./pages/BuildingMap";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/inventory"
              element={
                <Layout>
                  <Inventory />
                </Layout>
              }
            />

            <Route
              path="/map"
              element={
                <Layout>
                  <BuildingMap />
                </Layout>
              }
            />

            <Route
              path="/floors/:floorId"
              element={
                <Layout>
                  <Floor />
                </Layout>
              }
            />

            <Route
              path="/floors/:floorId/halls/:hallId"
              element={
                <Layout>
                  <Hall />
                </Layout>
              }
            />

            <Route
              path="/floors/:floorId/halls/:hallId/rooms/:roomId"
              element={
                <Layout>
                  <Room />
                </Layout>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
