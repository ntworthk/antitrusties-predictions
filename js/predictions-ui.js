const PredictionsUI = {
    initialize() {
        this.predictionInput = document.getElementById('prediction-text');
        this.submitButton = document.getElementById('submit-button');
        this.statusMessage = document.getElementById('status-message');
        this.refreshButton = document.getElementById('refresh-button');
        this.predictionsGrid = document.querySelector('.predictions-grid');
        this.submissionControls = document.querySelector('.submission-controls');
        
        this.setupEventListeners();
        this.loadPredictions();
    },

    setupEventListeners() {
        this.submitButton.addEventListener('click', () => this.handleSubmission());

        this.predictionInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.handleSubmission();
            }
        });

        this.refreshButton.addEventListener('click', () => this.loadPredictions());
        
        // Add scroll event listener for sticky header
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.submissionControls.classList.add('scrolled');
            } else {
                this.submissionControls.classList.remove('scrolled');
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
            
            const result = await PredictionsState.submitPrediction(predictionText);
            
            if (result.status === 'success') {
                this.showStatus('Prediction submitted successfully!', 'success');
                this.predictionInput.value = '';
                await this.loadPredictions();
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

    async loadPredictions() {
        try {
            this.refreshButton.classList.add('rotating');
            await PredictionsState.loadPredictions();
            this.renderPredictions();
        } catch (error) {
            this.showStatus('Error loading predictions', 'error');
        } finally {
            this.refreshButton.classList.remove('rotating');
        }
    },

    renderPredictions() {
        this.predictionsGrid.innerHTML = '';
        
        if (PredictionsState.predictions.length === 0) {
            this.predictionsGrid.innerHTML = `
                <div class="no-predictions">
                    No predictions have been submitted yet.
                </div>
            `;
            return;
        }

        PredictionsState.predictions.forEach(prediction => {
            const predictionCard = document.createElement('div');
            predictionCard.className = 'prediction-card';
            
            const statusIcon = prediction.status === 'correct' ? 'fa-check-circle text-success' :
                             prediction.status === 'incorrect' ? 'fa-times-circle text-danger' :
                             'fa-question-circle text-warning';
            const statusText = prediction.status === 'correct' ? 'Correct prediction' :
                             prediction.status === 'incorrect' ? 'Incorrect prediction' :
                             'Pending prediction';
            
            predictionCard.innerHTML = `
                <div class="status-indicator" title="${statusText}">
                    <i class="fas ${statusIcon}"></i>
                </div>
                <div class="prediction-content">
                    <p class="prediction-text">${prediction.text}</p>
                    ${prediction.notes ? `<p class="prediction-notes">${prediction.notes}</p>` : ''}
                </div>
            `;
            
            this.predictionsGrid.appendChild(predictionCard);
        });
    },

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.className = 'status-message hidden';
            }, 5000);
        }
    }
};