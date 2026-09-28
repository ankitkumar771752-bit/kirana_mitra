const Store = require('../models/store_model');

const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores.', error: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store.', error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create store.', error: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update store.', error: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json({ message: 'Store deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store.', error: error.message });
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
