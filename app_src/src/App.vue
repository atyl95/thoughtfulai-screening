<script setup lang="ts">
import { ref, computed } from 'vue'
import { sortWithDetails, testCases, type PackageResult } from './utils/packageSorter'

// Form inputs
const width = ref<number>(50)
const height = ref<number>(50)
const length = ref<number>(50)
const mass = ref<number>(10)

// Animation and state
const selectedTestCase = ref('')

// Computed result with proper error handling
const result = computed<{ data: PackageResult | null; error: string }>(() => {
  try {
    const data = sortWithDetails(width.value, height.value, length.value, mass.value)
    return { data, error: '' }
  } catch (e) {
    return { 
      data: null, 
      error: e instanceof Error ? e.message : 'Invalid input' 
    }
  }
})

// Load test case
const loadTestCase = (caseName: string) => {
  const testCase = testCases.find(tc => tc.name === caseName)
  if (testCase) {
    width.value = testCase.width
    height.value = testCase.height
    length.value = testCase.length
    mass.value = testCase.mass
    selectedTestCase.value = caseName
  }
}

// Clear form
const clearForm = () => {
  width.value = 50
  height.value = 50
  length.value = 50
  mass.value = 10
  selectedTestCase.value = ''
}

// Format number with commas
const formatNumber = (num: number) => {
  return num.toLocaleString()
}
</script>

<template>
  <div class="app">
    <div class="container">
      <!-- Header -->
      <header class="header">
        <h1 class="title">Package Sorting System</h1>
        <p class="subtitle">Classify packages based on dimensions and weight</p>
        
        <!-- Classification Rules -->
        <div class="rules-summary">
          <p><strong>BULKY:</strong> Volume ≥ 1,000,000 cm³ or any dimension ≥ 150 cm | <strong>HEAVY:</strong> Mass ≥ 20 kg</p>
          <p><strong>STANDARD:</strong> Not bulky and not heavy | <strong>SPECIAL:</strong> Either bulky or heavy | <strong>REJECTED:</strong> Both bulky and heavy</p>
        </div>
      </header>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Input Form -->
        <div class="input-section">
          <h2>Package Details</h2>
          
          <!-- Test Cases -->
          <div class="test-cases">
            <label>Example Packages:</label>
            <div class="test-buttons">
              <button 
                v-for="testCase in testCases" 
                :key="testCase.name"
                @click="loadTestCase(testCase.name)"
                :class="{ active: selectedTestCase === testCase.name }"
                class="test-button"
              >
                {{ testCase.name }}
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="form-grid">
            <div class="input-group">
              <label for="width">Width (cm)</label>
              <input 
                id="width"
                v-model.number="width" 
                type="number" 
                min="0.01" 
                step="0.01"
                class="input"
              />
            </div>
            
            <div class="input-group">
              <label for="height">Height (cm)</label>
              <input 
                id="height"
                v-model.number="height" 
                type="number" 
                min="0.01" 
                step="0.01"
                class="input"
              />
            </div>
            
            <div class="input-group">
              <label for="length">Length (cm)</label>
              <input 
                id="length"
                v-model.number="length" 
                type="number" 
                min="0.01" 
                step="0.01"
                class="input"
              />
            </div>
            
            <div class="input-group">
              <label for="mass">Mass (kg)</label>
              <input 
                id="mass"
                v-model.number="mass" 
                type="number" 
                min="0.01" 
                step="0.01"
                class="input"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="clearForm" class="clear-button">
              Reset to Defaults
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section">
          <h2>Result</h2>
          
          <!-- Error State -->
          <div v-if="result.error" class="error-card">
            <div class="error-header">
              <div class="error-type">Invalid Input</div>
            </div>
            <p class="error-message">{{ result.error }}</p>
            <p class="error-hint">All dimensions and mass must be positive values greater than 0.</p>
          </div>
          
          <!-- Valid Result -->
          <div v-else-if="result.data" class="result-card">
            <div class="result-header">
              <div class="result-type">{{ result.data.type }}</div>
            </div>
            
            <div class="result-details">
              <p class="result-reason">{{ result.data.reason }}</p>
              
              <div class="metrics">
                <div class="metric">
                  <span class="metric-label">Volume:</span>
                  <span class="metric-value">{{ formatNumber(result.data.volume) }} cm³</span>
                </div>
                
                <div class="metric">
                  <span class="metric-label">Dimensions:</span>
                  <span class="metric-value">{{ result.data.width }} × {{ result.data.height }} × {{ result.data.length }} cm</span>
                </div>
                
                <div class="metric">
                  <span class="metric-label">Mass:</span>
                  <span class="metric-value">{{ result.data.mass }} kg</span>
                </div>
              </div>

              <div class="flags">
                <div class="flag" :class="{ active: result.data.isBulky }">
                  {{ result.data.isBulky ? 'BULKY' : 'Not Bulky' }}
                </div>
                <div class="flag" :class="{ active: result.data.isHeavy }">
                  {{ result.data.isHeavy ? 'HEAVY' : 'Not Heavy' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 1rem 0;
}

.rules-summary {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

.rules-summary p {
  margin: 0 0 0.5rem 0;
}

.rules-summary p:last-child {
  margin-bottom: 0;
}

.error-card {
  border-radius: 6px;
  padding: 1.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.error-header {
  margin-bottom: 1rem;
}

.error-type {
  font-size: 1.2rem;
  font-weight: 600;
}

.error-message {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.error-hint {
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.8;
  margin: 0;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.input-section, .results-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.input-section h2, .results-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.test-cases {
  margin-bottom: 2rem;
}

.test-cases label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.test-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.test-button:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.test-button.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.clear-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
  color: #666;
}

.clear-button:hover {
  background: #e9ecef;
}



.result-card {
  border-radius: 6px;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e9ecef;
}

.result-header {
  margin-bottom: 1rem;
}

.result-type {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.result-reason {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #555;
  font-weight: 500;
}

.metrics {
  margin-bottom: 1.5rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.metric-label {
  font-weight: 600;
  color: #555;
}

.metric-value {
  font-weight: 500;
  color: #333;
}

.flags {
  display: flex;
  gap: 1rem;
}

.flag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  transition: all 0.3s ease;
}

.flag.active {
  background: #343a40;
  color: white;
}





@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .test-buttons {
    flex-direction: column;
  }
  

  
  .title {
    font-size: 2rem;
  }
  
  .container {
    padding: 1rem;
  }
  

}
</style>
