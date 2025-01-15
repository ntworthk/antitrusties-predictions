// submission-state.js
const SubmissionState = {
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
            return data;
        } catch (error) {
            console.error('Error submitting prediction:', error);
            throw error;
        }
    }
};
