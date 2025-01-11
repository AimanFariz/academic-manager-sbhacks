/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/upload',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'multipart/form-data',
                    },
                ],
            },
        ]
    },
    serverExternalPackages: ['mongoose'],
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        }
        return config
    },
}

module.exports = nextConfig 
