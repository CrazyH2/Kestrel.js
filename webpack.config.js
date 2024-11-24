export default {
    entry: './lib/engine.js', // Replace with your entry point
    output: {
        filename: 'kestrel.js',
        library: {
            type: "module"
        },
    },
    experiments: {
        outputModule: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    target: 'web',
    mode: 'production',
};