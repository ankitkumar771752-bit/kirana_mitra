const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 1, name: 'Groceries' },
      { id: 2, name: 'Vegetables' },
      { id: 3, name: 'Fruits' },
      { id: 4, name: 'Dairy' },
      { id: 5, name: 'Household' },
    ];

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories.', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    res.status(201).json({ message: 'Category created successfully.', data: req.body });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category.', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    res.status(200).json({ message: 'Category updated successfully.', data: req.body });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category.', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    res.status(200).json({ message: `Category ${req.params.id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category.', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
