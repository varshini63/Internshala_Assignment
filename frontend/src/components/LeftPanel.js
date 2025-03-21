import React, { useState } from 'react';

const LeftPanel = ({ patientId, sampleType, date }) => {
  const [actionStatus, setActionStatus] = useState(null);

  const handleGenerateReport = () => {
    setActionStatus({ type: 'report', message: 'Generating report...' });
    
    setTimeout(() => {
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Patient ${patientId} - Blood Sample Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2e7d32; }
            h2 { color: #1565c0; margin-top: 20px; }
            .header { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .section { margin: 20px 0; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Blood Sample Analysis Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Patient Information</h2>
            <p><strong>Patient ID:</strong> ${patientId}</p>
            <p><strong>Sample Type:</strong> ${sampleType}</p>
            <p><strong>Sample Date:</strong> ${date}</p>
          </div>
          
          <div class="section">
            <h2>Analysis Findings</h2>
            <p>Analysis shows multiple circular red blood cells (RBCs) detected in the sample. The image contains approximately 250 RBCs with consistent morphology.</p>
            <p>No abnormal cells or structures detected in this sample.</p>
          </div>
          
          <div class="section">
            <h2>Metrics</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Reference Range</th>
              </tr>
              <tr>
                <td>Total RBCs Detected</td>
                <td>250</td>
                <td>200-300</td>
              </tr>
              <tr>
                <td>Average RBC Size</td>
                <td>40x40 pixels</td>
                <td>35-45 pixels</td>
              </tr>
              <tr>
                <td>Cell Distribution</td>
                <td>Uniform</td>
                <td>Uniform</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>This report was automatically generated by the WSI Viewer System.</p>
            <p>For questions or concerns, please contact the laboratory.</p>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const reportWindow = window.open(url, '_blank');
      reportWindow.onload = () => {
        URL.revokeObjectURL(url);
      };
      
      setActionStatus({ type: 'report', message: 'Report generated successfully!' });
      setTimeout(() => setActionStatus(null), 3000);
    }, 1500);
  };

  const handleShareAnalysis = () => {
    setActionStatus({ type: 'share', message: 'Preparing to share analysis...' });
    
    const title = `Blood Sample Analysis - Patient ${patientId}`;
    const text = `Blood sample analysis for Patient ${patientId} from ${date}. Sample type: ${sampleType}.`;
    const url = window.location.href;
  
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      })
      .then(() => {
        setActionStatus({ type: 'share', message: 'Analysis shared successfully!' });
        setTimeout(() => setActionStatus(null), 3000);
      })
      .catch((error) => {
        setActionStatus({ type: 'share', message: 'Error sharing: ' + error.message });
        setTimeout(() => setActionStatus(null), 3000);
      });
    } else {
      const shareDialog = document.createElement('div');
      shareDialog.style.position = 'fixed';
      shareDialog.style.top = '50%';
      shareDialog.style.left = '50%';
      shareDialog.style.transform = 'translate(-50%, -50%)';
      shareDialog.style.backgroundColor = 'white';
      shareDialog.style.padding = '20px';
      shareDialog.style.borderRadius = '5px';
      shareDialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      shareDialog.style.zIndex = '1000';
      
      const shareHeader = document.createElement('h3');
      shareHeader.textContent = 'Share Analysis';
      
      const shareText = document.createElement('p');
      shareText.textContent = 'Copy the link below to share this analysis:';
      
      const shareInput = document.createElement('input');
      shareInput.type = 'text';
      shareInput.value = window.location.href;
      shareInput.style.width = '100%';
      shareInput.style.padding = '5px';
      shareInput.style.marginBottom = '10px';
      shareInput.readOnly = true;
      
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy Link';
      copyButton.style.padding = '8px 16px';
      copyButton.style.backgroundColor = '#2196f3';
      copyButton.style.color = 'white';
      copyButton.style.border = 'none';
      copyButton.style.borderRadius = '4px';
      copyButton.style.cursor = 'pointer';
      copyButton.style.marginRight = '10px';
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.padding = '8px 16px';
      closeButton.style.backgroundColor = '#f44336';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      
      copyButton.onclick = () => {
        shareInput.select();
        document.execCommand('copy');
        copyButton.textContent = 'Copied!';
        setTimeout(() => copyButton.textContent = 'Copy Link', 2000);
      };
      
      closeButton.onclick = () => {
        document.body.removeChild(shareDialog);
        setActionStatus({ type: 'share', message: 'Share dialog closed.' });
        setTimeout(() => setActionStatus(null), 3000);
      };
      
      shareDialog.appendChild(shareHeader);
      shareDialog.appendChild(shareText);
      shareDialog.appendChild(shareInput);
      shareDialog.appendChild(copyButton);
      shareDialog.appendChild(closeButton);
      document.body.appendChild(shareDialog);

      setTimeout(() => {
        shareInput.focus();
        shareInput.select();
      }, 100);
      
      setActionStatus({ type: 'share', message: 'Share dialog opened.' });
    }
  };

  const handleExportData = () => {
    setActionStatus({ type: 'export', message: 'Exporting data...' });
    
    setTimeout(() => {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Patient ID,Sample Type,Date,Total RBCs,Average Size,Cell Distribution,Min Size,Max Size,Density,Analysis Status\n" +
        `${patientId},${sampleType},${formattedDate},250,40x40,Uniform,35x35,45x45,Medium,Complete`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `patient_${patientId}_analysis_data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setActionStatus({ type: 'export', message: 'Data exported successfully!' });
      setTimeout(() => setActionStatus(null), 3000);
    }, 1500);
  };
  return (
    <div className="left-panel-content">
      <h2>Sample Information</h2>
      <div className="info-section">
        <p><strong>Patient ID:</strong> {patientId}</p>
        <p><strong>Sample Type:</strong> {sampleType}</p>
        <p><strong>Date:</strong> {date}</p>
      </div>
      
      <div className="findings-section">
        <h3>Findings</h3>
        <p>Analysis shows multiple circular red blood cells (RBCs) detected in the sample. The image contains approximately 250 RBCs with consistent morphology.</p>
        <p>No abnormal cells or structures detected in this sample.</p>
      </div>
      
      <div className="metrics-section">
        <h3>Metrics</h3>
        <p><strong>Total RBCs Detected:</strong> 250</p>
        <p><strong>Average RBC Size:</strong> 40x40 pixels</p>
        <p><strong>Cell Distribution:</strong> Uniform</p>
      </div>
      
      {actionStatus && (
        <div className={`status-message ${actionStatus.type}`}>
          {actionStatus.message}
        </div>
      )}
      
      <div className="actions-section">
        <button className="action-button" onClick={handleGenerateReport}>
          Generate Report
        </button>
        <button className="action-button" onClick={handleShareAnalysis}>
          Share Analysis
        </button>
        <button className="action-button" onClick={handleExportData}>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;