import axios, { AxiosResponse } from "axios";

export interface Transaction {
    userId: number,
    id: number,
    category: string,
    price: number,
    date: string,
    name?: string,
    description?: string
}

export interface BalanceInterface {
    id: number,
    userId: number,
    savings: number,
    budget: number,
    income: number,
}

export interface TransactionData {
    category: string;
    amount: number;
}

export interface CategoryData {
    category: string;
    price: number;
    date: number;
}

class TransactionApi {
    private baseUrl = 'http://localhost:5000';

    async addTransaction(userId: number, category: string, price: number, name?: string, description?: string): Promise<any> {
        try {
            const payload: { userId: number; category: string; price: number; name?: string; description?: string; } = {
                userId,
                category,
                price,
            };
    
            if (name !== undefined) {
                payload.name = name;
            }
            if (description !== undefined) {
                payload.description = description;
            }
    
            const response = await axios.post(`${this.baseUrl}/transactions`, payload);
    
            if (response.status === 200) {
                console.log('Transaction added successfully');
                return response;
            }
        } catch (error) {
            console.log('Error adding transaction:', error);
            throw error;
        }
    }
    

    async updateBalance(userId: number, budget: number, savings: number, income: number): Promise<void> {
        try {
            const response = await axios.put(`${this.baseUrl}/user/balance`, {
                userId,
                budget,
                savings,
                income
            });

            console.log(response);

            if (response.status !== 200) {
                throw new Error('Failed to update balance');
            }
        } catch (error) {
            throw new Error('Failed to update balance: ' + error);
        }
    }


    async getTransactions(userId?: number) {
        try {
            const response: AxiosResponse<any> = await axios.get(`${this.baseUrl}/transactions`, {
                params: { userId }
            });

            if (response.status === 200) {
                return response.data.transactions;
            }
        } catch (error) {
            console.log("Get transactions error");
            throw error;
        }
    }

    async getTransactionsForMonth(month: number, userId?: number): Promise<Transaction[]> {
        try {
            const response: AxiosResponse<any> = await axios.get(`http://localhost:5000/transactions/month?userId=${userId}&month=${month}`);
    
            if (response.status === 200) {
                return response.data.transactions as Transaction[];
            } else {
                console.log("Transactions for month error");
                throw new Error('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            throw error;
        }
    }

    async getTransactionsCategory(month: number, userId?: number): Promise<TransactionData[]> {
        try {
            const response: AxiosResponse<any> = await axios.get(`http://localhost:5000/transactions/category?userId=${userId}&month=${month}`);
    
            if (response.status === 200) {
                return response.data.categories as TransactionData[];
            } else {
                console.log("Transactions category error");
                throw new Error('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            throw error;
        }
    }

    async getCategories(month: number, year: number, category: string, userId?: number): Promise<CategoryData[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/transactions/categories?userId=${userId}&month=${month}&year=${year}&category=${category}`);

            if ( response.status === 200 ) {
                return response.data.transactions;
            } else {
                console.log("Get categories error");
                throw new Error('Unxpecrted status code: ' + response.status);
            }
        } catch (error) {
            throw error;
        }
    }
    

    async getBalance(userId: number): Promise<BalanceInterface[]> {
        console.log(userId);
        try {
            const response = await axios.get(`${this.baseUrl}/user/balance?userId=${userId}`, {});
    
            if (response.status === 200) {
                const balanceData = response.data; 
                return [{
                    id: balanceData.id,
                    savings: balanceData.savings,
                    income: balanceData.income,
                    budget: balanceData.budget,
                    userId: balanceData.userId,
                }];
            }
        } catch (error) {
            throw error;
        }
    
        return [];
    }
    

    async deleteTransaction(id: number) {
        try {
            const response = await axios.delete(`${this.baseUrl}/transactions`, {
                params: { id }
            });
            if(response.status === 200){
                return response.data;
            }
        } catch ( error ) {
            throw error;
        }
    }
}

export default TransactionApi;
