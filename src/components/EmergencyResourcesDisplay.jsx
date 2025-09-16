/**
 * Emergency Resources Display Component
 * Shows crisis resources and professional referrals when needed
 */

import React from 'react';

const EmergencyResourcesDisplay = ({ 
  resources, 
  professionalReferral, 
  onResourceClick, 
  onDismiss,
  className = '' 
}) => {
  if (!resources && !professionalReferral) {
    return null;
  }

  const handleResourceClick = (resource) => {
    if (onResourceClick) {
      onResourceClick(resource);
    }
    
    // For phone numbers, try to initiate call on mobile
    if (resource.contact && resource.contact.match(/^\d{3}$|^\d{3}-\d{3}-\d{4}$|^\d{10}$/)) {
      if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
        window.location.href = `tel:${resource.contact}`;
      }
    }
  };

  return (
    <div className={`emergency-resources ${className}`}>
      {resources && (
        <div className="crisis-resources">
          <div className="crisis-header">
            <div className="crisis-icon">🚨</div>
            <h3 className="crisis-title">{resources.title}</h3>
          </div>
          
          <div className="crisis-message">
            <p>If you're in immediate danger, please call emergency services or go to your nearest emergency room.</p>
          </div>
          
          <div className="resources-list">
            {resources.resources.map((resource, index) => (
              <div 
                key={index} 
                className="resource-item"
                onClick={() => handleResourceClick(resource)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleResourceClick(resource);
                  }
                }}
              >
                <div className="resource-header">
                  <h4 className="resource-name">{resource.name}</h4>
                  <span className="resource-availability">24/7</span>
                </div>
                <div className="resource-contact">{resource.contact}</div>
                <div className="resource-description">{resource.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {professionalReferral && (
        <div className="professional-referral">
          <div className="referral-header">
            <div className="referral-icon">👩‍⚕️</div>
            <h3 className="referral-title">Professional Support</h3>
          </div>
          
          <div className="referral-message">
            <p>{professionalReferral.message}</p>
          </div>
          
          {professionalReferral.suggestions && (
            <div className="referral-suggestions">
              <h4>Consider these options:</h4>
              <ul>
                {professionalReferral.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {professionalReferral.urgency === 'immediate' && (
            <div className="urgency-notice">
              <strong>⚠️ Immediate attention recommended</strong>
            </div>
          )}
        </div>
      )}
      
      {onDismiss && (
        <div className="resources-actions">
          <button 
            className="dismiss-button"
            onClick={onDismiss}
            aria-label="Acknowledge resources"
          >
            I understand
          </button>
        </div>
      )}
      
      <style jsx>{`
        .emergency-resources {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
          color: white;
          box-shadow: 0 4px 12px rgba(238, 90, 36, 0.3);
          border: 2px solid #ff4757;
        }
        
        .crisis-resources {
          margin-bottom: 20px;
        }
        
        .crisis-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .crisis-icon {
          font-size: 24px;
          margin-right: 12px;
        }
        
        .crisis-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
        }
        
        .crisis-message {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          border-left: 4px solid #fff;
        }
        
        .crisis-message p {
          margin: 0;
          font-weight: 600;
        }
        
        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .resource-item {
          background: rgba(255, 255, 255, 0.15);
          padding: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .resource-item:hover,
        .resource-item:focus {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          outline: none;
        }
        
        .resource-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .resource-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        
        .resource-availability {
          background: #2ed573;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .resource-contact {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
          font-family: 'Poppins', sans-serif;
        }
        
        .resource-description {
          font-size: 14px;
          opacity: 0.9;
          font-family: 'Quicksand', sans-serif;
        }
        
        .professional-referral {
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #fff;
        }
        
        .referral-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .referral-icon {
          font-size: 20px;
          margin-right: 12px;
        }
        
        .referral-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        
        .referral-message p {
          margin: 0 0 12px 0;
          font-family: 'Quicksand', sans-serif;
        }
        
        .referral-suggestions h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        
        .referral-suggestions ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .referral-suggestions li {
          margin-bottom: 4px;
          font-family: 'Quicksand', sans-serif;
          font-size: 14px;
        }
        
        .urgency-notice {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
        }
        
        .resources-actions {
          margin-top: 16px;
          text-align: center;
        }
        
        .dismiss-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .dismiss-button:hover,
        .dismiss-button:focus {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          outline: none;
        }
        
        @media (max-width: 768px) {
          .emergency-resources {
            margin: 12px 0;
            padding: 16px;
          }
          
          .resource-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .resource-availability {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyResourcesDisplay;