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

class TransactionApi {
    private baseUrl = 'http://localhost:5000';

    async addTransaction(userId: number, category: string, price: number, name?: string, description?: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/transactions`, {
                userId,
                category,
                price,
                name,
                description
            });

            if (response.status === 200) {
                return response;
            }
        } catch (error) {
            throw error;
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
            throw error;
        }
    }

    async getTransactionsForMonth(month: number, userId?: number): Promise<Transaction[]> {
        try {
            const response: AxiosResponse<any> = await axios.get(`http://localhost:5000/transactions/month?userId=${userId}&month=${month}`);
    
            if (response.status === 200) {
                return response.data.transactions as Transaction[];
            } else {
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
                return response.data as TransactionData[];
            } else {
                throw new Error('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            throw error;
        }
    }
    

    async getBalance(userId: number): Promise<BalanceInterface[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/balance`, {
                params: { userId }
            });

            if (response.status === 200) {
                return response.data.balance.map((balance: any) => ({
                    id: balance.id,
                    savings: balance.savings,
                    income: balance.income,
                    budget: balance.budget,
                    userId: balance.userId,
                }));
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
            console.log(response);
            if(response.status === 200){
                return response.data;
            }
        } catch ( error ) {
            throw error;
        }
    }
}

export default TransactionApi;
