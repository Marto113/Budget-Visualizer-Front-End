import React, { useState } from 'react';
import TransactionApi from '../services/transactionApi';
import { useParams } from 'react-router-dom';

enum TransactionCategory {
  Entertainment = "Entertainment",
  Groceries = "Groceries",
  Bills = "Bills",
  Transportation = "Transportation",
  Utilities = "Utilities",
  Food = "Food",
  Health = "Health",
  Clothing = "Clothing",
  Travel = "Travel",
  Miscellaneous = "Miscellaneous"
}

const TransactionForm: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
  const [formData, setFormData] = useState({
    category: TransactionCategory.Entertainment,
    name: '',
    price: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const transactionApi = new TransactionApi();
    try {
      await transactionApi.addTransaction(userId!, formData.category, formData.price, formData.name);
      setFormData({
        category: TransactionCategory.Entertainment,
        name: '',
        price: 0
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
          {Object.values(TransactionCategory).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TransactionForm;
