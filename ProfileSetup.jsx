import React, { useState } from 'react';
import './ProfileSetup.css';

const ProfileSetup = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        mood: '',
        goal: 'Relaxation',
        profilePicture: null
    });

    const [isFlowerAnimating, setIsFlowerAnimating] = useState(false);

    const moodOptions = [
        { emoji: '😊', value: 'happy', label: 'Happy' },
        { emoji: '😐', value: 'neutral', label: 'Neutral' },
        { emoji: '😔', value: 'sad', label: 'Sad' }
    ];

    const goalOptions = [
        'Relaxation',
        'Focus',
        'Self-care',
        'Stress relief'
    ];

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
        // Trigger flower animation when user interacts
        setIsFlowerAnimating(true);
        setTimeout(() => setIsFlowerAnimating(false), 1000);
    };

    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({ ...prev, profilePicture: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContinue = () => {
        console.log('Profile data:', profileData);
        // Handle continue logic here
    };

    const handleSkip = () => {
        console.log('Skipping profile setup');
        // Handle skip logic here
    };

    return (
        <div className="profile-setup">
            {/* Background Elements */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Top Bar */}
            <div className="top-bar">
                <button className="back-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="logo">ZenZone</div>
            </div>

            {/* ZenBloom Mascot */}
            <div className={`zenbloom-mascot ${isFlowerAnimating ? 'animate' : ''}`}>
                <div className="flower">
                    <div className="petals">
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                        <div className="petal"></div>
                    </div>
                    <div className="center">
                        <div className="eyes">
                            <div className="eye"></div>
                            <div className="eye"></div>
                        </div>
                        <div className="mouth"></div>
                    </div>
                </div>
                <div className="stem"></div>
                <div className="leaves">
                    <div className="leaf left"></div>
                    <div className="leaf right"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content">
                <h1 className="title">Profile Setup</h1>

                {/* Profile Picture Upload */}
                <div className="form-group">
                    <div className="profile-picture-section">
                        <input
                            type="file"
                            id="profile-picture"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="profile-picture" className="profile-picture-upload">
                            {profileData.profilePicture ? (
                                <img src={profileData.profilePicture} alt="Profile" className="profile-image" />
                            ) : (
                                <div className="upload-placeholder">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            )}
                        </label>
                        <span className="upload-label">Profile picture</span>
                    </div>
                </div>

                {/* Name Input */}
                <div className="form-group">
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="Enter your name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </div>

                {/* Mood Preference */}
                <div className="form-group">
                    <label className="form-label">Mood preference</label>
                    <div className="mood-options">
                        {moodOptions.map((mood) => (
                            <button
                                key={mood.value}
                                className={`mood-button ${profileData.mood === mood.value ? 'selected' : ''}`}
                                onClick={() => handleInputChange('mood', mood.value)}
                            >
                                <span className="mood-emoji">{mood.emoji}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goal Selection */}
                <div className="form-group">
                    <label className="form-label">Goal</label>
                    <select
                        className="glass-select"
                        value={profileData.goal}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                    >
                        {goalOptions.map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="actions">
                    <button className="continue-button" onClick={handleContinue}>
                        Continue
                    </button>
                    <button className="skip-button" onClick={handleSkip}>
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;