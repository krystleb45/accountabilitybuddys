import React from 'react';
import ResourceLinks from './components/ResourceLinks';
import Disclaimer from './components/Disclaimer';
import ChatBox from './components/ChatBox';

const MilitarySupport: React.FC = () => {
    return (
        <div className="military-support-container">
            <h1>Military Support Section</h1>
            <p>Welcome to the Military Support Section. Connect with peers, share messages, and find helpful resources.</p>
            <Disclaimer />
            <ChatBox />
            <ResourceLinks />
        </div>
    );
};

export default MilitarySupport;
