import run from '@rollup/plugin-run'
import alias from '@rollup/plugin-alias'
import globImport from 'rollup-plugin-glob-import'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'

const dev = process.env.ROLLUP_WATCH === 'true';



export default {
	input: 'src/http.js',
	output: {
		file: 'dist/app.js',
		format: 'es'
	},
	external: [ /node_modules/ ],
	plugins: [
		nodeResolve(),
		alias({
			entries: {
				'@': path.resolve('src'),
			},
		}),
		globImport(),
		
		dev ? run({
			allowRestarts: true,
			execArgv: [ '-r', 'dotenv/config' ],
		}) : null,
	]
}
