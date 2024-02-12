import axios, { AxiosResponse } from "axios";

export interface Transaction {
    id: string,
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

class TransactionApi {
    private baseUrl = 'http://localhost:5000';

    async addTransaction(category: string, price: number, name?: string, description?: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/transactions`, {
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
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    }

    async getTransactionsForMonth(month: number, userId?: number) {
        try {
            if (month === null || month === undefined) {
                const date = new Date();
                month = date.getMonth() + 1;
            }
    
            if (userId === undefined) {
                throw new Error('userId is undefined')
            }
    
            const response: AxiosResponse<any> = await axios.get(`${this.baseUrl}/transactions/month`, {
                params: { userId, month }
            });
    
            if (response.status === 200) {
                return response.data;
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
}

export default TransactionApi;
