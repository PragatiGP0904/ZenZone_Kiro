import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import HabitTrackingService from '../services/HabitTrackingService.js';
import GraphGenerationService from '../services/GraphGenerationService.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HabitCorrelationChart = ({ 
  chartType = 'correlation', 
  habitId = null, 
  days = 30,
  onExport = null,
  className = ''
}) => {
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  
  const habitService = new HabitTrackingService();
  const graphService = new GraphGenerationService(habitService);

  useEffect(() => {
    generateChart();
  }, [chartType, habitId, days]);

  const generateChart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize habits if needed
      habitService.initializeHabits();

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
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }

      if (!data) {
        setError('Insufficient data to generate chart. Please add more habit entries.');
        return;
      }

      setChartData(data);
      
      // Generate insights for correlation charts
      if (chartType === 'correlation') {
        const generatedInsights = graphService.generateInsights(days);
        setInsights(generatedInsights);
      }

    } catch (err) {
      console.error('Error generating chart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!chartRef.current || !onExport) return;

    try {
      const imageData = graphService.exportChartAsImage(chartRef.current);
      onExport(imageData, chartType);
    } catch (err) {
      console.error('Error exporting chart:', err);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      ref: chartRef,
      data: chartData.data,
      options: chartData.options
    };

    switch (chartData.type) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const renderInsights = () => {
    if (insights.length === 0) return null;

    return (
      <div className="habit-insights">
        <h4>Insights</h4>
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`insight insight-${insight.type}`}
          >
            <strong>{insight.habit}:</strong> {insight.message}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`habit-chart-container loading ${className}`}>
        <div className="loading-spinner">Generating chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`habit-chart-container error ${className}`}>
        <div className="error-message">
          <h4>Unable to Generate Chart</h4>
          <p>{error}</p>
          <button onClick={generateChart} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`habit-chart-container ${className}`}>
      <div className="chart-header">
        {onExport && (
          <button onClick={handleExport} className="export-button">
            Export Chart
          </button>
        )}
      </div>
      
      <div className="chart-wrapper">
        {renderChart()}
      </div>
      
      {renderInsights()}
      
      <style jsx>{`
        .habit-chart-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
        }

        .habit-chart-container.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .loading-spinner {
          font-size: 16px;
          color: #6B7280;
        }

        .habit-chart-container.error {
          text-align: center;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-message h4 {
          color: #EF4444;
          margin-bottom: 8px;
        }

        .error-message p {
          color: #6B7280;
          margin-bottom: 16px;
        }

        .retry-button {
          background: #4F46E5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .retry-button:hover {
          background: #4338CA;
        }

        .chart-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .export-button {
          background: #10B981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .export-button:hover {
          background: #059669;
        }

        .chart-wrapper {
          height: 300px;
          margin-bottom: 20px;
        }

        .habit-insights {
          border-top: 1px solid #E5E7EB;
          padding-top: 16px;
        }

        .habit-insights h4 {
          margin-bottom: 12px;
          color: #374151;
          font-size: 16px;
        }

        .insight {
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 14px;
        }

        .insight-positive {
          background: #D1FAE5;
          color: #065F46;
          border-left: 4px solid #10B981;
        }

        .insight-warning {
          background: #FEF3C7;
          color: #92400E;
          border-left: 4px solid #F59E0B;
        }

        .insight-info {
          background: #DBEAFE;
          color: #1E40AF;
          border-left: 4px solid #3B82F6;
        }

        .insight-success {
          background: #D1FAE5;
          color: #065F46;
          border-left: 4px solid #059669;
        }

        @media (max-width: 768px) {
          .habit-chart-container {
            padding: 16px;
            margin: 12px 0;
          }

          .chart-wrapper {
            height: 250px;
          }

          .insight {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitCorrelationChart;