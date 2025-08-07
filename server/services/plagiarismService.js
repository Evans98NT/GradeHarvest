const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

// Copyleaks API Service
class CopyleaksService {
  constructor() {
    this.apiKey = process.env.COPYLEAKS_API_KEY;
    this.email = process.env.COPYLEAKS_EMAIL;
    this.baseUrl = 'https://api.copyleaks.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await axios.post(`${this.baseUrl}/v3/account/login/api`, {
        email: this.email,
        key: this.apiKey
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Copyleaks authentication failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Copyleaks');
    }
  }

  async submitDocument(filePath, scanId) {
    try {
      const token = await this.authenticate();
      const fileBuffer = await fs.readFile(path.join(__dirname, '..', filePath));
      
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: path.basename(filePath),
        contentType: 'application/octet-stream'
      });

      const response = await axios.post(
        `${this.baseUrl}/v3/education/submissions/file/${scanId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...formData.getHeaders()
          }
        }
      );

      return {
        success: true,
        scanId,
        status: 'submitted',
        submittedAt: new Date()
      };
    } catch (error) {
      console.error('Copyleaks document submission failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async getResults(scanId) {
    try {
      const token = await this.authenticate();
      
      const response = await axios.get(
        `${this.baseUrl}/v3/education/submissions/${scanId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const result = response.data;
      
      return {
        success: true,
        scanId,
        status: result.status,
        score: result.results?.score?.aggregatedScore || 0,
        reportUrl: result.results?.reportUrl,
        completedAt: new Date(),
        details: {
          identicalWords: result.results?.score?.identicalWords || 0,
          minorChangesWords: result.results?.score?.minorChangesWords || 0,
          relatedMeaningWords: result.results?.score?.relatedMeaningWords || 0,
          totalWords: result.results?.score?.totalWords || 0
        }
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          scanId,
          status: 'processing',
          message: 'Scan still in progress'
        };
      }
      
      console.error('Copyleaks results retrieval failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

// GPTZero AI Detection Service
class GPTZeroService {
  constructor() {
    this.apiKey = process.env.GPTZERO_API_KEY;
    this.baseUrl = 'https://api.gptzero.me';
  }

  async checkDocument(filePath) {
    try {
      if (!this.apiKey) {
        throw new Error('GPTZero API key not configured');
      }

      const fileContent = await fs.readFile(path.join(__dirname, '..', filePath), 'utf8');
      
      const response = await axios.post(
        `${this.baseUrl}/v2/predict/text`,
        {
          document: fileContent
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;
      
      return {
        success: true,
        score: Math.round(result.documents[0]?.average_generated_prob * 100) || 0,
        status: 'completed',
        detector: 'GPTZero',
        completedAt: new Date(),
        details: {
          sentences: result.documents[0]?.sentences || [],
          paragraphs: result.documents[0]?.paragraphs || [],
          completely_generated_prob: result.documents[0]?.completely_generated_prob || 0,
          overall_burstiness: result.documents[0]?.overall_burstiness || 0
        }
      };
    } catch (error) {
      console.error('GPTZero check failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: 'failed'
      };
    }
  }
}

// Turnitin API Service (Placeholder - requires institutional access)
class TurnitinService {
  constructor() {
    this.apiKey = process.env.TURNITIN_API_KEY;
    this.baseUrl = 'https://api.turnitin.com';
  }

  async submitDocument(filePath, submissionId) {
    try {
      // This is a placeholder implementation
      // Turnitin requires institutional licensing and specific setup
      
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Turnitin API not configured'
        };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        submissionId,
        status: 'submitted',
        message: 'Document submitted to Turnitin (simulated)',
        submittedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getResults(submissionId) {
    try {
      // Placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate random results for demo
      const score = Math.floor(Math.random() * 30); // 0-30% similarity
      
      return {
        success: true,
        submissionId,
        status: 'completed',
        score,
        reportUrl: `https://turnitin.com/report/${submissionId}`,
        completedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Main Plagiarism Service
class PlagiarismService {
  constructor() {
    this.copyleaks = new CopyleaksService();
    this.gptzero = new GPTZeroService();
    this.turnitin = new TurnitinService();
  }

  async checkDocument(filePath) {
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Initialize results object
      const results = {
        scanId,
        filePath,
        startedAt: new Date(),
        copyleaksResult: { status: 'pending' },
        turnitinResult: { status: 'pending' },
        aiContentCheck: { status: 'pending' },
        overallStatus: 'orange'
      };

      // Run all checks in parallel
      const [copyleaksResult, aiResult, turnitinResult] = await Promise.allSettled([
        this.copyleaks.submitDocument(filePath, scanId),
        this.gptzero.checkDocument(filePath),
        this.turnitin.submitDocument(filePath, scanId)
      ]);

      // Process Copyleaks result
      if (copyleaksResult.status === 'fulfilled' && copyleaksResult.value.success) {
        results.copyleaksResult = copyleaksResult.value;
      } else {
        results.copyleaksResult = {
          status: 'failed',
          error: copyleaksResult.reason?.message || 'Copyleaks check failed'
        };
      }

      // Process AI detection result
      if (aiResult.status === 'fulfilled' && aiResult.value.success) {
        results.aiContentCheck = aiResult.value;
      } else {
        results.aiContentCheck = {
          status: 'failed',
          error: aiResult.reason?.message || 'AI detection failed'
        };
      }

      // Process Turnitin result
      if (turnitinResult.status === 'fulfilled' && turnitinResult.value.success) {
        results.turnitinResult = turnitinResult.value;
      } else {
        results.turnitinResult = {
          status: 'failed',
          error: turnitinResult.reason?.message || 'Turnitin check failed'
        };
      }

      // Determine overall status
      results.overallStatus = this.determineOverallStatus(results);
      
      return results;
    } catch (error) {
      console.error('Plagiarism check failed:', error);
      return {
        scanId,
        filePath,
        startedAt: new Date(),
        copyleaksResult: { status: 'failed', error: error.message },
        turnitinResult: { status: 'failed', error: error.message },
        aiContentCheck: { status: 'failed', error: error.message },
        overallStatus: 'red'
      };
    }
  }

  async getUpdatedResults(scanId, originalResults) {
    try {
      const updatedResults = { ...originalResults };
      let hasUpdates = false;

      // Check Copyleaks if still pending
      if (originalResults.copyleaksResult?.status === 'submitted') {
        const copyleaksUpdate = await this.copyleaks.getResults(scanId);
        if (copyleaksUpdate.status !== 'processing') {
          updatedResults.copyleaksResult = copyleaksUpdate;
          hasUpdates = true;
        }
      }

      // Check Turnitin if still pending
      if (originalResults.turnitinResult?.status === 'submitted') {
        const turnitinUpdate = await this.turnitin.getResults(scanId);
        if (turnitinUpdate.status !== 'processing') {
          updatedResults.turnitinResult = turnitinUpdate;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        updatedResults.overallStatus = this.determineOverallStatus(updatedResults);
        updatedResults.lastUpdated = new Date();
      }

      return updatedResults;
    } catch (error) {
      console.error('Failed to get updated results:', error);
      return originalResults;
    }
  }

  determineOverallStatus(results) {
    const { copyleaksResult, turnitinResult, aiContentCheck } = results;
    
    // Check for high plagiarism scores
    const plagiarismThresholds = { high: 25, medium: 15 };
    const aiThresholds = { high: 80, medium: 50 };
    
    let maxPlagiarismScore = 0;
    let maxAiScore = 0;
    
    // Get highest plagiarism score
    if (copyleaksResult?.score) maxPlagiarismScore = Math.max(maxPlagiarismScore, copyleaksResult.score);
    if (turnitinResult?.score) maxPlagiarismScore = Math.max(maxPlagiarismScore, turnitinResult.score);
    
    // Get AI detection score
    if (aiContentCheck?.score) maxAiScore = aiContentCheck.score;
    
    // Determine status based on scores
    if (maxPlagiarismScore >= plagiarismThresholds.high || maxAiScore >= aiThresholds.high) {
      return 'red'; // High risk
    } else if (maxPlagiarismScore >= plagiarismThresholds.medium || maxAiScore >= aiThresholds.medium) {
      return 'orange'; // Medium risk
    } else if (copyleaksResult?.status === 'completed' || turnitinResult?.status === 'completed' || aiContentCheck?.status === 'completed') {
      return 'green'; // Low risk
    } else {
      return 'orange'; // Pending/Unknown
    }
  }

  async generateReport(results) {
    try {
      const report = {
        scanId: results.scanId,
        filePath: results.filePath,
        generatedAt: new Date(),
        overallStatus: results.overallStatus,
        summary: {
          plagiarismScore: 0,
          aiScore: 0,
          recommendations: []
        },
        details: {
          copyleaks: results.copyleaksResult,
          turnitin: results.turnitinResult,
          aiDetection: results.aiContentCheck
        }
      };

      // Calculate summary scores
      const plagiarismScores = [];
      if (results.copyleaksResult?.score) plagiarismScores.push(results.copyleaksResult.score);
      if (results.turnitinResult?.score) plagiarismScores.push(results.turnitinResult.score);
      
      if (plagiarismScores.length > 0) {
        report.summary.plagiarismScore = Math.max(...plagiarismScores);
      }
      
      if (results.aiContentCheck?.score) {
        report.summary.aiScore = results.aiContentCheck.score;
      }

      // Generate recommendations
      if (report.summary.plagiarismScore > 25) {
        report.summary.recommendations.push('High plagiarism detected. Document requires significant revision.');
      } else if (report.summary.plagiarismScore > 15) {
        report.summary.recommendations.push('Moderate plagiarism detected. Review and cite sources properly.');
      }

      if (report.summary.aiScore > 80) {
        report.summary.recommendations.push('High probability of AI-generated content detected.');
      } else if (report.summary.aiScore > 50) {
        report.summary.recommendations.push('Possible AI-generated content detected. Manual review recommended.');
      }

      if (report.summary.recommendations.length === 0) {
        report.summary.recommendations.push('Document appears to be original with proper citations.');
      }

      return report;
    } catch (error) {
      console.error('Report generation failed:', error);
      throw new Error('Failed to generate plagiarism report');
    }
  }
}

// Export singleton instance
const plagiarismService = new PlagiarismService();

module.exports = {
  checkDocument: (filePath) => plagiarismService.checkDocument(filePath),
  getUpdatedResults: (scanId, originalResults) => plagiarismService.getUpdatedResults(scanId, originalResults),
  generateReport: (results) => plagiarismService.generateReport(results),
  
  // Export classes for testing
  CopyleaksService,
  GPTZeroService,
  TurnitinService,
  PlagiarismService
};
