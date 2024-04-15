const path = require('path');
const esbuild = require('esbuild');
const fs = require('fs');
const { minify, optimize, html, zip, stats } = require('./packager');

const entry = path.resolve('./src/main.js');
const useWatch = process.argv.includes('--watch');
const useMinify = process.argv.includes('--minify');
const useRoadroller = process.argv.includes('--roadroll');

const mp3ToBase64 = (filePath) => {
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    return `data:audio/mp3;base64,${base64Data}`;
};
  
const audioLoaderPlugin = {
    name: 'mp3-loader',
    setup(build) {
        build.onLoad({ filter: /\.wav$/ }, async (args) => {
            const filePath = path.resolve(args.path);
            const base64String = mp3ToBase64(filePath);
            return {
                contents: `${base64String}`,
                loader: 'text',
            };
        });
    },
};

let postBuildPlugin = {
    name: 'Post-Build',
    setup(build) {
        build.onEnd(async() => {
            if (useMinify) {
                minify();
            }
            if (useRoadroller) {
                await optimize();
            }
            html();
            await zip();
            stats();
        })
    },
}

async function run() {
    const ctx = await esbuild.context({
        entryPoints: [entry],
        outfile: './dist/build.js',
        bundle: true,
        plugins: [audioLoaderPlugin, postBuildPlugin],
    });

    if (useWatch) {
        await ctx.watch();
    }
    console.log('watching...');
}
run();
