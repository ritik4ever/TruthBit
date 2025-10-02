import React, { useState, useEffect } from 'react';
import { FileText, Eye, Shield } from 'lucide-react';
import IdentityCard from '../components/IdentityCard';
import ArticleCard from '../components/ArticleCard';
import { apiService } from '../services/apiService';

function Dashboard({ user }) {
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState({
        totalArticles: 0,
        totalViews: 0,
        verifiedStatus: 'verified'
    });

    useEffect(() => {
        loadDashboard();
    }, [user]);

    const loadDashboard = async () => {
        try {
            // Get all articles (not just user's articles)
            const allArticles = await apiService.getArticles();

            // Filter to show user's articles AND anonymous ones they created
            const userArticles = allArticles.filter(article =>
                article.authorId === user.id ||
                // Check if anonymous article was created in this session
                (article.anonymous && localStorage.getItem(`my_article_${article.id}`))
            );

            setArticles(userArticles);

            const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
            setStats({
                totalArticles: userArticles.length,
                totalViews: totalViews,
                verifiedStatus: user.verificationLevel
            });
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '32px' }}>
                Dashboard
            </h1>

            <div className="grid grid-3" style={{ marginBottom: '40px' }}>
                <StatCard
                    icon={<FileText size={24} />}
                    label="Articles Published"
                    value={stats.totalArticles}
                    color="var(--primary)"
                />
                <StatCard
                    icon={<Eye size={24} />}
                    label="Total Views"
                    value={stats.totalViews}
                    color="var(--secondary)"
                />
                <StatCard
                    icon={<Shield size={24} />}
                    label="Verification Status"
                    value={stats.verifiedStatus}
                    color="#667eea"
                />
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
                    Your Identity
                </h2>
                <IdentityCard identity={user} />
            </div>

            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
                    Your Publications
                </h2>
                {articles.length === 0 ? (
                    <div style={{
                        padding: '60px',
                        textAlign: 'center',
                        background: 'var(--light)',
                        borderRadius: 'var(--radius)'
                    }}>
                        <p style={{ color: 'var(--dark-medium)', fontSize: '16px' }}>
                            You haven't published any articles yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {articles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="card">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color
                }}>
                    {icon}
                </div>
                <div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        marginBottom: '4px'
                    }}>
                        {value}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: 'var(--dark-medium)'
                    }}>
                        {label}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;