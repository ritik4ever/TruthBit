export const truncate = (str, length = 10) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

export const validateOrdinalId = (id) => {
    return /^ord_[a-zA-Z0-9]+$/.test(id);
};

export const compressContent = (content) => {
    // Placeholder for content compression
    return content;
};

export const estimateInscriptionFee = (contentSize) => {
    const baseRate = 5; // sats per byte
    return contentSize * baseRate;
};