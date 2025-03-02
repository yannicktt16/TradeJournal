import React, { useState, useEffect } from 'react'

function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [newAccount, setNewAccount] = useState({
    name: '',
    broker: '',
    brokerAccountId: '',
    balance: '',
    currency: 'USD',
    leverage: '',
    accountType: 'live',
    description: ''
  })
  const [editAccount, setEditAccount] = useState(null)

  // Load accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || []
    setAccounts(savedAccounts)
  }, [])

  const saveAccount = () => {
    if (!newAccount.name || !newAccount.broker || !newAccount.brokerAccountId || !newAccount.balance) {
      alert('Please fill in all required fields')
      return
    }

    const accountData = {
      ...newAccount,
      id: Date.now(),
      balance: parseFloat(newAccount.balance),
      leverage: parseInt(newAccount.leverage) || 1
    }

    if (editAccount) {
      // Update existing account
      const updatedAccounts = accounts.map(acc => 
        acc.id === editAccount.id ? accountData : acc
      )
      setAccounts(updatedAccounts)
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
      setEditAccount(null)
    } else {
      // Add new account
      const updatedAccounts = [...accounts, accountData]
      setAccounts(updatedAccounts)
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
    }

    setNewAccount({
      name: '',
      broker: '',
      brokerAccountId: '',
      balance: '',
      currency: 'USD',
      leverage: '',
      accountType: 'live',
      description: ''
    })
  }

  const deleteAccount = (id) => {
    const updatedAccounts = accounts.filter(account => account.id !== id)
    setAccounts(updatedAccounts)
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
  }

  const startEditAccount = (account) => {
    setEditAccount(account)
    setNewAccount(account)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>

      {/* Account Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">
          {editAccount ? 'Edit Account' : 'Create New Account'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Fields */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Account Name *</label>
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Broker *</label>
            <input
              type="text"
              value={newAccount.broker}
              onChange={(e) => setNewAccount({...newAccount, broker: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Broker Account ID *</label>
            <input
              type="text"
              value={newAccount.brokerAccountId}
              onChange={(e) => setNewAccount({...newAccount, brokerAccountId: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Starting Balance *</label>
            <input
              type="number"
              step="0.01"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Optional Fields */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={newAccount.currency}
              onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Leverage</label>
            <input
              type="number"
              value={newAccount.leverage}
              onChange={(e) => setNewAccount({...newAccount, leverage: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              value={newAccount.accountType}
              onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="live">Live</option>
              <option value="demo">Demo</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newAccount.description}
              onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>
        <button
          onClick={saveAccount}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {editAccount ? 'Update Account' : 'Create Account'}
        </button>
        {editAccount && (
          <button
            onClick={() => {
              setEditAccount(null)
              setNewAccount({
                name: '',
                broker: '',
                brokerAccountId: '',
                balance: '',
                currency: 'USD',
                leverage: '',
                accountType: 'live',
                description: ''
              })
            }}
            className="mt-4 ml-4 bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <p className="text-sm text-gray-600">
                  {account.broker} ({account.brokerAccountId}) - {account.accountType}
                </p>
                <p className="text-sm text-gray-600">
                  Balance: {account.balance.toFixed(2)} {account.currency}
                  {account.leverage && ` | Leverage: 1:${account.leverage}`}
                </p>
                {account.description && (
                  <p className="text-sm text-gray-600 mt-2">{account.description}</p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => startEditAccount(account)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAccount(account.id)}
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
  )
}

export default AccountManagement
