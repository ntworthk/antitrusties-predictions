// submission-ui.js
const SubmissionUI = {
    initialize() {
        this.predictionInput = document.getElementById('prediction-text');
        this.submitButton = document.getElementById('submit-button');
        this.statusMessage = document.getElementById('status-message');
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.submitButton.addEventListener('click', async () => {
            await this.handleSubmission();
        });

        // Allow submission with Ctrl+Enter or Cmd+Enter
        this.predictionInput.addEventListener('keydown', async (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                await this.handleSubmission();
            }
        });
    },

    async handleSubmission() {
        const predictionText = this.predictionInput.value.trim();
        
        if (!predictionText) {
            this.showStatus('Please enter a prediction', 'error');
            return;
        }

        try {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Submitting...';
            
            const result = await SubmissionState.submitPrediction(predictionText);
            
            if (result.status === 'success') {
                this.showStatus('Prediction submitted successfully!', 'success');
                this.predictionInput.value = ''; // Clear input on success
            } else {
                this.showStatus(result.message || 'Failed to submit prediction', 'error');
            }
        } catch (error) {
            this.showStatus('Error submitting prediction', 'error');
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Submit Prediction';
        }
    },

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        // Hide the message after 5 seconds if it's a success message
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.className = 'status-message hidden';
            }, 5000);
        }
    }
};