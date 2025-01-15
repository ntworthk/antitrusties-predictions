// predictions-state.js
const PredictionsState = {
    predictions: [],

    async submitPrediction(predictionText) {
        try {
            // Convert prediction to base64
            const predictionBase64 = btoa(JSON.stringify([predictionText]));
            
            const response = await fetch('https://cardioid.co.nz/api/submit_prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prediction_base64: predictionBase64
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                await this.loadPredictions(); // Refresh predictions after successful submission
            }
            return data;
        } catch (error) {
            console.error('Error submitting prediction:', error);
            throw error;
        }
    },

    async loadPredictions() {
        try {
            const response = await fetch('https://cardioid.co.nz/api/predictions');
            const data = await response.json();
            
            if (data.status === 'success') {
                this.predictions = data.predictions;
            } else {
                throw new Error(data.message || 'Failed to load predictions');
            }
            
            return data;
        } catch (error) {
            console.error('Error loading predictions:', error);
            throw error;
        }
    }
};
