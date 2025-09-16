# Habit-Feeling Correlation Graph Generation

This feature implements a comprehensive habit tracking and correlation analysis system that generates visual graphs showing the relationship between user habits and emotional states.

## Overview

The system allows users to track 4-5 daily habits and their associated feelings, then automatically generates correlation graphs when sufficient data is collected. These graphs are integrated with the chat interface through the ImagePlaceholder system.

## Components

### Core Services

#### `HabitTrackingService`
- **Purpose**: Manages habit data collection and storage
- **Features**:
  - Initialize default habits (Exercise, Sleep Quality, Meditation, Social Interaction, Work/Productivity)
  - Record habit entries with feeling values (1-5 scale)
  - Calculate habit-feeling correlations and trends
  - Data persistence using localStorage
  - Summary statistics and data quality assessment

#### `GraphGenerationService`
- **Purpose**: Creates visual charts using Chart.js
- **Features**:
  - Correlation bar charts showing habit trends
  - Time series line charts for individual habits
  - Mood distribution doughnut charts
  - Dashboard data compilation
  - Chart export functionality (PNG/JSON)
  - Automatic insights generation

#### `HabitAnalytics`
- **Purpose**: Advanced data analysis and pattern recognition
- **Features**:
  - Pearson correlation calculations
  - Day-of-week pattern analysis
  - Streak detection (positive/negative)
  - Cross-habit correlation analysis
  - Consistency scoring
  - Data quality assessment

### React Components

#### `HabitCorrelationChart`
- **Purpose**: React component for displaying charts
- **Props**:
  - `chartType`: 'correlation', 'timeseries', 'distribution'
  - `habitId`: Required for timeseries charts
  - `days`: Time range for analysis (default: 30)
  - `onExport`: Callback for chart export
- **Features**:
  - Loading states and error handling
  - Responsive design for mobile
  - Automatic insights display
  - Export functionality

#### `HabitGraphPlaceholder`
- **Purpose**: Smart placeholder that integrates with ImagePlaceholder system
- **Features**:
  - Automatic data availability checking
  - Fallback to placeholder when insufficient data
  - Integration with chat message system
  - Multiple chart type support

#### `SmartHabitGraph`
- **Purpose**: Automatically selects best chart type based on available data
- **Features**:
  - Intelligent chart type selection
  - Adaptive to data quantity and quality
  - Seamless integration with chat interface

## Usage

### Basic Setup

```javascript
import { HabitTrackingService, GraphGenerationService } from './services/';
import { HabitCorrelationChart } from './components/';

// Initialize services
const habitService = new HabitTrackingService();
const graphService = new GraphGenerationService(habitService);

// Initialize habits
habitService.initializeHabits();
```

### Recording Habit Entries

```javascript
// Record a habit entry
const entry = habitService.recordHabitEntry(
  'exercise',        // habitId
  4,                 // feelingValue (1-5)
  'Great workout!',  // notes (optional)
  new Date()         // timestamp (optional)
);
```

### Generating Charts

```javascript
// Check if sufficient data exists
if (habitService.hasSufficientData()) {
  // Generate correlation chart
  const chartData = graphService.generateCorrelationChartData(30);
  
  // Generate time series for specific habit
  const timeSeriesData = graphService.generateHabitTimeSeriesData('exercise', 30);
  
  // Generate mood distribution
  const distributionData = graphService.generateMoodDistributionData(30);
}
```

### React Component Usage

```jsx
// Basic correlation chart
<HabitCorrelationChart 
  chartType="correlation"
  days={30}
  onExport={(imageData, type) => console.log('Exported:', type)}
/>

// Time series for specific habit
<HabitCorrelationChart 
  chartType="timeseries"
  habitId="exercise"
  days={30}
/>

// Smart placeholder that adapts to data availability
<HabitGraphPlaceholder 
  chartType="correlation"
  width={300}
  height={200}
  showPlaceholder={true}
/>

// Auto-selecting smart graph
<SmartHabitGraph 
  width={400}
  height={250}
  days={30}
/>
```

### Integration with Chat Interface

```jsx
import { HabitGraphPlaceholder } from './components/';

// In AI message component
<AIMessageImageContainer hasImage={true}>
  <p>Here's your habit correlation analysis:</p>
  <HabitGraphPlaceholder 
    chartType="correlation"
    width={300}
    height={200}
  />
</AIMessageImageContainer>
```

## Data Structure

### Habit Entry
```javascript
{
  id: "unique-id",
  habitId: "exercise",
  feelingValue: 4,
  notes: "Great workout today!",
  timestamp: "2024-01-15T10:00:00.000Z",
  date: "2024-01-15"
}
```

### Correlation Analysis
```javascript
{
  habitName: "Exercise",
  correlation: 0.75,
  averageFeeling: 4.2,
  entryCount: 15,
  trend: 0.3,
  trendDirection: "improving",
  insufficient: false
}
```

### Chart Data Format
```javascript
{
  type: "bar",
  data: {
    labels: ["Exercise", "Sleep", "Meditation"],
    datasets: [{
      label: "Feeling Trend",
      data: [0.5, -0.2, 0.3],
      backgroundColor: ["#10B981", "#EF4444", "#3B82F6"]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    // ... chart configuration
  }
}
```

## Features

### ✅ Implemented Features

1. **Habit Data Collection System**
   - 5 default habits (Exercise, Sleep Quality, Meditation, Social Interaction, Work/Productivity)
   - Feeling scale (1-5) with descriptive labels
   - Notes and timestamp tracking
   - localStorage persistence

2. **Automatic Graph Generation**
   - Chart.js integration with react-chartjs-2
   - Multiple chart types (bar, line, doughnut)
   - Responsive design for mobile devices
   - Loading states and error handling

3. **Visual Correlation Charts**
   - Habit-feeling correlation bar charts
   - Time series analysis for individual habits
   - Overall mood distribution visualization
   - Color-coded trend indicators

4. **ImagePlaceholder Integration**
   - Smart placeholder component
   - Automatic data availability checking
   - Fallback to placeholder when insufficient data
   - Seamless chat interface integration

5. **Data Analysis Logic**
   - Pearson correlation calculations
   - Trend analysis using linear regression
   - Day-of-week pattern recognition
   - Streak detection and consistency scoring

6. **Export Functionality**
   - PNG image export for charts
   - JSON data export
   - Downloadable files with timestamps
   - Integration with browser download API

7. **Comprehensive Unit Tests**
   - Service layer testing (HabitTrackingService, GraphGenerationService)
   - Analytics testing (HabitAnalytics)
   - Component testing (HabitCorrelationChart)
   - Integration testing (complete workflow)
   - Error handling and edge cases

### Data Requirements

- **Minimum for basic graphs**: 5 entries
- **Recommended for correlations**: 10+ entries
- **Optimal for patterns**: 20+ entries over 2+ weeks

### Chart Types

1. **Correlation Chart** (Bar)
   - Shows trend direction for each habit
   - Color-coded: Green (improving), Red (declining), Blue (stable)
   - Includes insights and recommendations

2. **Time Series Chart** (Line)
   - Individual habit progression over time
   - Feeling levels (1-5) plotted against dates
   - Trend line and pattern visualization

3. **Mood Distribution Chart** (Doughnut)
   - Overall feeling distribution across all habits
   - Percentage breakdown of mood levels
   - Visual representation of emotional patterns

## Testing

The system includes comprehensive test coverage:

```bash
# Run all habit-related tests
npm test HabitTrackingService.test.js
npm test GraphGenerationService.test.js
npm test HabitAnalytics.test.js
npm test HabitCorrelationChart.test.jsx
npm test HabitGraphIntegration.test.js
```

### Test Coverage
- ✅ Data collection and storage
- ✅ Correlation calculations
- ✅ Chart generation
- ✅ Component rendering
- ✅ Error handling
- ✅ Export functionality
- ✅ Integration workflows

## Demo

Run the demo to see the system in action:

```jsx
import HabitCorrelationDemo from './demo/HabitCorrelationDemo.jsx';

// The demo includes:
// - Interactive habit entry form
// - Sample data generation
// - Live chart updates
// - Export functionality demonstration
// - Integration examples
```

## Dependencies

- **Chart.js**: Chart rendering library
- **react-chartjs-2**: React wrapper for Chart.js
- **React**: UI framework
- **localStorage**: Data persistence (browser API)

## Integration Points

### With Existing Chat System
- Integrates with `ImagePlaceholder` component
- Uses existing mobile chat styling
- Follows established error handling patterns
- Compatible with message bubble layout

### With Progress Tracking
- Correlates with existing mood tracking (ProgressChart.jsx)
- Enhances progress visualization
- Provides deeper insights into mood patterns

### With AI Responses
- Graphs can be triggered by AI analysis
- Automatic generation based on conversation context
- Insights can inform AI recommendations

## Future Enhancements

Potential extensions for this system:

1. **Real Image Generation**: Replace placeholders with actual generated images
2. **Advanced Analytics**: Machine learning for pattern prediction
3. **Social Features**: Anonymous habit sharing and comparison
4. **Wearable Integration**: Heart rate, sleep data correlation
5. **Professional Integration**: Secure sharing with therapists
6. **Voice Input**: Voice-to-text for habit logging
7. **Reminders**: Smart notifications for habit tracking
8. **Goals**: Habit-based goal setting and achievement tracking

## Performance Considerations

- **Lazy Loading**: Charts only render when needed
- **Data Limits**: Automatic cleanup of old entries
- **Caching**: Chart data caching for repeated requests
- **Mobile Optimization**: Touch-friendly interactions
- **Memory Management**: Efficient data structures

## Security & Privacy

- **Local Storage**: All data stored locally on device
- **No External APIs**: No habit data sent to external services
- **Data Encryption**: Consider implementing for sensitive data
- **User Control**: Easy data export and deletion
- **HIPAA Considerations**: Mental health data handling guidelines

This implementation provides a solid foundation for habit-feeling correlation analysis while maintaining integration with the existing mental health chat application.