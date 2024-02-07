import axios, { AxiosResponse } from "axios";

export interface Transaction {
    id: string,
    category: string,
    price: number,
    date: string,
    name?: string,
    description?: string
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

            if (response.status == 200) {
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

    async getTransactionsForMonth(userId: string, month: number) {
        try {
            const response: AxiosResponse<Transaction[]> = await axios.get(`${this.baseUrl}/transactions/month`, {
                params: { userId, month}
            });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default TransactionApi;
