import React from 'react';
import { CheckCircle, UserX, AlertTriangle } from 'lucide-react';

function VerificationBadge({ level }) {
    const configs = {
        verified: {
            icon: <CheckCircle size={14} />,
            text: 'Verified',
            className: 'badge-verified'
        },
        anonymous: {
            icon: <UserX size={14} />,
            text: 'Anonymous',
            className: 'badge-anonymous'
        },
        whistleblower: {
            icon: <AlertTriangle size={14} />,
            text: 'Whistleblower',
            className: 'badge-whistleblower'
        },
        public: {
            icon: <CheckCircle size={14} />,
            text: 'Public',
            className: 'badge-verified'
        }
    };

    const config = configs[level] || configs.anonymous;

    return (
        <span className={`badge ${config.className}`}>
            {config.icon}
            {config.text}
        </span>
    );
}

export default VerificationBadge;