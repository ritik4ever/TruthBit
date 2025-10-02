// Open Ordinal API setup for TruthVault
window.truthVaultAPI = {
    version: '1.0.0',

    init() {
        if (!window.ooAPI) {
            console.error('Open Ordinal API not loaded');
            return;
        }

        const ooAPI = window.ooAPI;

        // Add collection
        const collection = new ooAPI.Collection({
            name: 'TruthVault Articles',
            description: 'Censorship-proof journalism and whistleblower documents',
            collectionTraits: [
                { name: 'Classification', traitNames: ['Public', 'Authenticated', 'Whistleblower'] },
                { name: 'Verification', traitNames: ['Verified', 'Anonymous'] }
            ]
        });

        ooAPI.addCollection(collection);
    },

    setupArticle(metadata) {
        const ooAPI = window.ooAPI;

        // Add article metadata as traits
        if (metadata.classification) {
            ooAPI.addTrait({
                name: 'Classification',
                value: metadata.classification
            });
        }

        if (metadata.author) {
            ooAPI.addTrait({
                name: 'Author',
                value: metadata.author
            });
        }

        // Add default variant
        ooAPI.addVariant({
            type: 'text',
            name: 'default',
            onDisplay: () => {
                document.body.innerHTML = metadata.content;
            }
        });

        ooAPI.ready();
    }
};