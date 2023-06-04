import axios from 'axios';

const BASE_URL = 'http://ec2-13-59-69-158.us-east-2.compute.amazonaws.com:10101'; // Replace with your EC2 instance IP
// const BASE_URL = 'http://localhost:10101'; // Replace with your EC2 instance IP
const ApiService = {
    predict: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/predict`, data);
            return response.data.predictions;
        } catch (error) {
            console.error('Error occurred while making API request:', error);
            throw error;
        }
    },
    classify: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/classify`, data);
            return response.data.predictions;
        } catch (error) {
            console.error('Error occurred while making API request:', error);
            throw error;
        }
    }
};

export default ApiService;
