import React, { useState, useEffect } from 'react'

function TradeJournal() {
  const [trades, setTrades] = useState([])
  const [newTrade, setNewTrade] = useState({
    ticket: '',
    openTime: '',
    type: 'buy',
    size: '',
    item: '',
    price: '',
    sl: '',
    tp: '',
    closeTime: '',
    closePrice: '',
    commission: '',
    taxes: '',
    swap: '',
    profit: '',
    account: ''
  })
  const [brokerInput, setBrokerInput] = useState('')
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [editTrade, setEditTrade] = useState(null)
  const [inputMode, setInputMode] = useState('manual')
  const [accounts, setAccounts] = useState([])

  // Load trades and accounts from localStorage on component mount
  useEffect(() => {
    const savedTrades = JSON.parse(localStorage.getItem('trades')) || []
    const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || []
    setTrades(savedTrades)
    setAccounts(savedAccounts)
  }, [])

  const parseBrokerLine = (line) => {
    const parts = line.split('\t')
    return {
      ticket: parts[0],
      openTime: parts[1].replace(/\./g, '-').replace(' ', 'T'),
      type: parts[2].toLowerCase(),
      size: parseFloat(parts[3]),
      item: parts[4].toUpperCase(),
      price: parseFloat(parts[5]),
      sl: parseFloat(parts[6]),
      tp: parseFloat(parts[7]),
      closeTime: parts[8].replace(/\./g, '-').replace(' ', 'T'),
      closePrice: parseFloat(parts[9]),
      commission: parseFloat(parts[10]),
      taxes: parseFloat(parts[11]),
      swap: parseFloat(parts[12]),
      profit: parseFloat(parts[13]),
      account: accounts.length > 0 ? accounts[0].name : 'Default'
    }
  }

  const handleBrokerImport = () => {
    try {
      const lines = brokerInput.split('\n')
      const importedTrades = lines.map(line => parseBrokerLine(line.trim()))
      setNewTrade(importedTrades[0]) // Populate manual input with first trade
      setInputMode('manual')
    } catch (error) {
      alert('Error parsing broker input: ' + error.message)
    }
  }

  const saveTrade = () => {
    if (!newTrade.ticket || !newTrade.openTime || !newTrade.size || !newTrade.item || !newTrade.price || !newTrade.account) {
      alert('Please fill in all required fields')
      return
    }

    const updatedTrade = {
      ...newTrade,
      item: newTrade.item.toUpperCase()
    }

    if (editTrade) {
      const updatedTrades = trades.map(t => 
        t.ticket === editTrade.ticket ? updatedTrade : t
      )
      setTrades(updatedTrades)
      localStorage.setItem('trades', JSON.stringify(updatedTrades))
      setEditTrade(null)
    } else {
      const updatedTrades = [...trades, updatedTrade]
      setTrades(updatedTrades)
      localStorage.setItem('trades', JSON.stringify(updatedTrades))
    }

    setNewTrade({
      ticket: '',
      openTime: '',
      type: 'buy',
      size: '',
      item: '',
      price: '',
      sl: '',
      tp: '',
      closeTime: '',
      closePrice: '',
      commission: '',
      taxes: '',
      swap: '',
      profit: '',
      account: accounts.length > 0 ? accounts[0].name : ''
    })
  }

  const deleteTrade = (ticket) => {
    const updatedTrades = trades.filter(t => t.ticket !== ticket)
    setTrades(updatedTrades)
    localStorage.setItem('trades', JSON.stringify(updatedTrades))
  }

  return (
    <div className="p-6">
      {/* Input Mode Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setInputMode('manual')}
          className={`px-4 py-2 rounded-lg ${
            inputMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Manual Input
        </button>
        <button
          onClick={() => setInputMode('broker')}
          className={`px-4 py-2 rounded-lg ${
            inputMode === 'broker' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Broker Import
        </button>
      </div>

      {/* Manual Input Form */}
      {inputMode === 'manual' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-6">Manual Trade Input</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
              <input
                type="text"
                value={newTrade.ticket}
                onChange={(e) => setNewTrade({...newTrade, ticket: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Open Time</label>
              <input
                type="datetime-local"
                value={newTrade.openTime}
                onChange={(e) => setNewTrade({...newTrade, openTime: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Trade Type</label>
              <select
                value={newTrade.type}
                onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <input
                type="number"
                step="0.01"
                value={newTrade.size}
                onChange={(e) => setNewTrade({...newTrade, size: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item</label>
              <input
                type="text"
                value={newTrade.item}
                onChange={(e) => setNewTrade({...newTrade, item: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                step="0.0001"
                value={newTrade.price}
                onChange={(e) => setNewTrade({...newTrade, price: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stop Loss</label>
              <input
                type="number"
                step="0.0001"
                value={newTrade.sl}
                onChange={(e) => setNewTrade({...newTrade, sl: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Take Profit</label>
              <input
                type="number"
                step="0.0001"
                value={newTrade.tp}
                onChange={(e) => setNewTrade({...newTrade, tp: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Close Time</label>
              <input
                type="datetime-local"
                value={newTrade.closeTime}
                onChange={(e) => setNewTrade({...newTrade, closeTime: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Close Price</label>
              <input
                type="number"
                step="0.0001"
                value={newTrade.closePrice}
                onChange={(e) => setNewTrade({...newTrade, closePrice: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Commission</label>
              <input
                type="number"
                step="0.01"
                value={newTrade.commission}
                onChange={(e) => setNewTrade({...newTrade, commission: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Taxes</label>
              <input
                type="number"
                step="0.01"
                value={newTrade.taxes}
                onChange={(e) => setNewTrade({...newTrade, taxes: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Swap</label>
              <input
                type="number"
                step="0.01"
                value={newTrade.swap}
                onChange={(e) => setNewTrade({...newTrade, swap: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profit</label>
              <input
                type="number"
                step="0.01"
                value={newTrade.profit}
                onChange={(e) => setNewTrade({...newTrade, profit: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account</label>
              <select
                value={newTrade.account}
                onChange={(e) => setNewTrade({...newTrade, account: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                {accounts.map((account) => (
                  <option key={account.name} value={account.name}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={saveTrade}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editTrade ? 'Update Trade' : 'Add Trade'}
            </button>
          </div>
        </div>
      )}

      {/* Broker Import Section */}
      {inputMode === 'broker' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-6">Broker Import</h2>
          <textarea
            value={brokerInput}
            onChange={(e) => setBrokerInput(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows="6"
            placeholder="Paste broker statement lines here..."
          />
          <div className="flex space-x-4">
            <button
              onClick={handleBrokerImport}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Import Trade
            </button>
          </div>
        </div>
      )}

      {/* Trade List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Trade History</h2>
        <div className="space-y-4">
          {trades.map((trade) => (
            <div key={trade.ticket} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{trade.item}</span>
                  <span className={`ml-2 text-sm ${
                    trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({trade.type.toUpperCase()})
                  </span>
                </div>
                <div className="text-gray-600 text-sm">
                  {new Date(trade.openTime).toLocaleString()}
                </div>
                <div className={`font-medium ${
                  trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${trade.profit.toFixed(2)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setNewTrade(trade)
                      setEditTrade(trade)
                      setInputMode('manual')
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTrade(trade.ticket)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TradeJournal
