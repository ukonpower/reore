
import fs, { watch } from 'fs';
import path from 'path';

import chokidar from 'chokidar';
import { Plugin } from 'vite';


let watcher: chokidar.FSWatcher | null = null;

const componentsDir = "./src/ts/gl/Resources/Components/";
const componentListFile = "./src/ts/gl/Resources/_data/componentList.ts";

const updateComponentList = ( ) => {

	const getIndexTsFiles = ( dir: string, fileList:string[] = [] ) => {

		const files = fs.readdirSync( dir );

		files.forEach( file => {

			const filePath = path.join( dir, file );
			const stat = fs.statSync( filePath );

			if ( stat.isDirectory() ) {

				if ( path.relative( componentsDir, dir ).split( '/' ).length < 2 ) {

					getIndexTsFiles( filePath, fileList );

				}

			} else if ( stat.isFile() && file === 'index.ts' ) {

				fileList.push( filePath );

			}

		} );

		return fileList;

	};

	const fileList = getIndexTsFiles( componentsDir );

	const components = fileList.map( ( file ) => {

		const fileContent = fs.readFileSync( file, 'utf-8' );

		const lines = fileContent.split( '\n' );

		const componentClassName = lines.find( ( line ) => line.startsWith( 'export class' ) );

		if ( componentClassName === undefined ) {

			return;

		}

		const componentClassNameArray = componentClassName.split( ' ' );

		const componentName = componentClassNameArray[ 2 ];

		return {

			name: componentName,
			relativePath: path.relative( path.dirname( componentListFile ), file ).replace( /\\/g, '/' )

		};

	} );

	// componentlist

	const componentCatGroups: {[category: string]: string[]} = {};

	components.forEach( ( component ) => {

		if ( component === undefined ) {

			return;

		}

		const category = component.relativePath.split( '/' )[ 2 ];

		const catArray = componentCatGroups[ category ] || [];

		catArray.push( component.name );

		componentCatGroups[ category ] = catArray;

	} );

	// write file

	let file = "";

	components.forEach( ( component ) => {

		if ( component === undefined ) {

			return;

		}

		file += `import { ${component.name} } from '${component.relativePath}';\n`;

	} );

	file += "\n";

	file += "export const COMPONENTLIST: {[key: string]: any} = {\n";

	Object.keys( componentCatGroups ).forEach( ( category ) => {

		file += `\t${category}: [\n`;

		componentCatGroups[ category ].forEach( ( component ) => {

			file += `\t\t${component},\n`;

		} );

		file += "\t],\n";

	} );

	file += "};\n";

	fs.writeFileSync( componentListFile, file );

};

export const ResourceManager = (): Plugin => ( {
	name: 'ResourceManager',
	enforce: 'pre',
	configureServer: ( server ) => {

		if ( watcher !== null ) {

			watcher.close();

		}

		watcher = chokidar.watch( "./src/ts/gl/Resources/Components/", {
			ignored: /[\\/\\]\./,
			persistent: true
		} );

		const onAddFile = ( ) => {

			updateComponentList();

		};

		const onUnlinkFile = ( ) => {

			updateComponentList();

		};

		const onChangeFile = ( path: string ) => {

			if ( path.endsWith( 'index.ts' ) ) {

				updateComponentList();

			}

		};

		watcher.on( 'ready', () => {

			watcher.on( 'add', onAddFile );

			watcher.on( 'change', onChangeFile );

			watcher.on( 'unlink', onUnlinkFile );

			watcher.on( 'error', function ( err ) {

				console.log( `Watcher error: ${err}` );

			} );

		} );


	},
	buildStart: () => {

		updateComponentList();

	},
	buildEnd: () => {

		if ( watcher ) {

			watcher.close();
			watcher = null;

		}

	},
} );
