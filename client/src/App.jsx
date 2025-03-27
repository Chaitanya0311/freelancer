import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DineIn from './pages/DineIn';
import TakeAway from './pages/TakeAway';
import Tables from './pages/Tables';
import Categories from './pages/Categories';
import Dishes from './pages/Dishes';
import Taxes from './pages/Taxes';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dine-in" element={<DineIn />} />
                    <Route path="take-away" element={<TakeAway />} />
                    <Route path="tables" element={<Tables />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="dishes" element={<Dishes />} />
                    <Route path="taxes" element={<Taxes />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App; 