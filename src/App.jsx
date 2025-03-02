import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import TradeJournal from './components/TradeJournal'
import AccountManagement from './components/AccountManagement'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold">Trading Journal</span>
              </div>
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/trades" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Trade Journal
                </Link>
                <Link to="/accounts" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Accounts
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trades" element={<TradeJournal />} />
              <Route path="/accounts" element={<AccountManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
