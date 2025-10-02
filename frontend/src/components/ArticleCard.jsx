import React from 'react';
import { Calendar, Eye, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import VerificationBadge from './VerificationBadge';

function ArticleCard({ article }) {
    const navigate = useNavigate();

    return (
        <div
            className="card"
            onClick={() => navigate(`/article/${article.id}`)}
            style={{ cursor: 'pointer' }}
        >
            {article.coverImage && (
                <div style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    background: `url(${article.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} />
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <VerificationBadge level={article.classification} />
                {article.encrypted && (
                    <span className="badge" style={{ background: '#FFF4E6', color: '#FF9500' }}>
                        <Lock size={14} />
                        Encrypted
                    </span>
                )}
            </div>

            <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                lineHeight: 1.3
            }}>
                {article.title}
            </h3>

            <p style={{
                color: 'var(--dark-medium)',
                fontSize: '15px',
                marginBottom: '16px',
                lineHeight: 1.5
            }}>
                {article.excerpt}
            </p>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--dark-medium)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} />
                    {article.views || 0} views
                </div>
            </div>

            <div style={{
                marginTop: '12px',
                fontSize: '13px',
                color: 'var(--secondary)',
                fontWeight: 500
            }}>
                By: {article.authorName || 'Anonymous'}
            </div>
        </div>
    );
}

export default ArticleCard;