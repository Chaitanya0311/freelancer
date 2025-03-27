import React, { useState, useRef } from 'react';
import Tables from '../components/Tables';
import Menu from '../components/Menu';
import Cart from '../components/Cart';

const DineIn = () => {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const cartRef = useRef();

    const handleTableSelect = (table) => {
        console.log('DineIn: Table selected:', table);
        setSelectedTableId(table.id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                {/* Left Section - Tables */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
                    <Tables 
                        onTableSelect={handleTableSelect}
                        selectedTableId={selectedTableId}
                    />
                </div>

                {/* Middle Section - Menu */}
                <div className="lg:col-span-6 bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Menu</h2>
                        {!selectedTableId ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-200">
                                <svg className="w-12 h-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-lg text-yellow-700 font-medium text-center">
                                    Please select a table to view the menu and start ordering
                                </p>
                            </div>
                        ) : (
                            <Menu onAddToCart={(dish) => cartRef.current?.addToCart(dish)} />
                        )}
                    </div>
                </div>

                {/* Right Section - Cart */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
                    <Cart 
                        ref={cartRef}
                        tableId={selectedTableId}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-sm">Available</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                            <span className="text-sm">Occupied</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                            <span className="text-sm">Reserved</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {selectedTableId ? (
                            <span className="font-medium text-blue-600">
                                Currently serving Table {selectedTableId}
                            </span>
                        ) : (
                            <span>No table selected</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DineIn; 