/**
 * Habit Graph Placeholder Component
 * Integrates habit correlation graphs with the ImagePlaceholder system
 * Displays graphs when sufficient data is available, otherwise shows placeholder
 */
import React, { useState, useEffect } from 'react';
import HabitCorrelationChart from './HabitCorrelationChart.jsx';
import { ImagePlaceholder } from './ImagePlaceholder.jsx';
import HabitTrackingService from '../services/HabitTrackingService.js';
import GraphGenerationService from '../services/GraphGenerationService.js';

const HabitGraphPlaceholder = ({ 
  chartType = 'correlation',
  habitId = null,
  days = 30,
  width = 300,
  height = 200,
  showPlaceholder = true,
  onGraphGenerated = null,
  className = "",
  style = {}
}) => {
  const [canGenerateGraph, setCanGenerateGraph] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  const habitService = new HabitTrackingService();
  const graphService = new GraphGenerationService(habitService);

  useEffect(() => {
    checkDataAvailability();
  }, [chartType, habitId, days]);

  const checkDataAvailability = () => {
    try {
      habitService.initializeHabits();
      const hasSufficientData = graphService.canGenerateGraphs();
      setCanGenerateGraph(hasSufficientData);
      
      if (hasSufficientData) {
        generateGraphData();
      }
    } catch (err) {
      console.error('Error checking data availability:', err);
      setError(err.message);
    }
  };

  const generateGraphData = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      let data = null;
      
      switch (chartType) {
        case 'correlation':
          data = graphService.generateCorrelationChartData(days);
          break;
        case 'timeseries':
          if (!habitId) {
            throw new Error('Habit ID required for time series chart');
          }
          data = graphService.generateHabitTimeSeriesData(habitId, days);
          break;
        case 'distribution':
          data = graphService.generateMoodDistributionData(days);
          break;
        case 'dashboard':
          data = graphService.generateDashboardData(days);
          break;
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }

      setGraphData(data);
      
      if (onGraphGenerated && data) {
        onGraphGenerated(data, chartType);
      }

    } catch (err) {
      console.error('Error generating graph data:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (imageData, type) => {
    // Create download link for the exported image
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `habit-${type}-chart-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerStyle = {
    width: `${width}px`,
    minHeight: `${height}px`,
    ...style
  };

  // Show loading state while generating
  if (isGenerating) {
    return (
      <div className={`habit-graph-placeholder generating ${className}`} style={containerStyle}>
        <div className="generating-content">
          <div className="spinner">📊</div>
          <p>Analyzing your habits...</p>
        </div>
        <style jsx>{`
          .habit-graph-placeholder.generating {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F8FAFC;
            border: 2px dashed #CBD5E1;
            border-radius: 12px;
            text-align: center;
          }
          
          .generating-content {
            padding: 20px;
          }
          
          .spinner {
            font-size: 24px;
            animation: spin 2s linear infinite;
            margin-bottom: 8px;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .generating-content p {
            margin: 0;
            color: #64748B;
            font-family: 'Quicksand', sans-serif;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`habit-graph-placeholder error ${className}`} style={containerStyle}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <p>Unable to generate graph</p>
          <small>{error}</small>
          <button onClick={checkDataAvailability} className="retry-btn">
            Try Again
          </button>
        </div>
        <style jsx>{`
          .habit-graph-placeholder.error {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FEF2F2;
            border: 2px dashed #FECACA;
            border-radius: 12px;
            text-align: center;
          }
          
          .error-content {
            padding: 20px;
          }
          
          .error-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          .error-content p {
            margin: 0 0 4px 0;
            color: #DC2626;
            font-family: 'Quicksand', sans-serif;
            font-size: 14px;
            font-weight: 600;
          }
          
          .error-content small {
            color: #7F1D1D;
            font-size: 12px;
            display: block;
            margin-bottom: 12px;
          }
          
          .retry-btn {
            background: #DC2626;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          }
          
          .retry-btn:hover {
            background: #B91C1C;
          }
        `}</style>
      </div>
    );
  }

  // Show actual graph if data is available
  if (canGenerateGraph && graphData) {
    return (
      <div className={`habit-graph-placeholder with-graph ${className}`} style={containerStyle}>
        <HabitCorrelationChart
          chartType={chartType}
          habitId={habitId}
          days={days}
          onExport={handleExport}
        />
      </div>
    );
  }

  // Show placeholder if not enough data or showPlaceholder is true
  if (showPlaceholder) {
    return (
      <div className={`habit-graph-placeholder no-data ${className}`} style={containerStyle}>
        <ImagePlaceholder
          width={width}
          height={height}
          alt="Habit correlation graph will appear here"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}
        />
        <div className="placeholder-overlay">
          <div className="placeholder-content">
            <div className="chart-icon">📈</div>
            <p>Habit Insights Coming Soon</p>
            <small>Keep tracking your habits to see correlations</small>
          </div>
        </div>
        <style jsx>{`
          .habit-graph-placeholder.no-data {
            position: relative;
          }
          
          .placeholder-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(102, 126, 234, 0.9);
            border-radius: 12px;
            text-align: center;
          }
          
          .placeholder-content {
            color: white;
            padding: 20px;
          }
          
          .chart-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }
          
          .placeholder-content p {
            margin: 0 0 4px 0;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
          }
          
          .placeholder-content small {
            font-family: 'Quicksand', sans-serif;
            font-size: 12px;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  // Fallback to regular image placeholder
  return (
    <ImagePlaceholder
      width={width}
      height={height}
      alt="Habit correlation graph placeholder"
      className={className}
      style={style}
    />
  );
};

/**
 * Smart Habit Graph Component
 * Automatically determines the best chart type based on available data
 */
export const SmartHabitGraph = ({ 
  width = 300, 
  height = 200, 
  days = 30,
  onGraphGenerated = null,
  className = "",
  style = {}
}) => {
  const [bestChartType, setBestChartType] = useState('correlation');
  const habitService = new HabitTrackingService();

  useEffect(() => {
    determineBestChartType();
  }, [days]);

  const determineBestChartType = () => {
    const summaryStats = habitService.getSummaryStats(days);
    
    if (summaryStats.totalEntries >= 20) {
      setBestChartType('correlation');
    } else if (summaryStats.totalEntries >= 10) {
      setBestChartType('distribution');
    } else {
      setBestChartType('correlation'); // Default fallback
    }
  };

  return (
    <HabitGraphPlaceholder
      chartType={bestChartType}
      days={days}
      width={width}
      height={height}
      onGraphGenerated={onGraphGenerated}
      className={className}
      style={style}
    />
  );
};

export default HabitGraphPlaceholder;