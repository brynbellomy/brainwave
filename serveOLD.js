#!/usr/bin/env node

// anywhere -h localhost -p 1337 -d ./build

var http = require('http')
var inertia = require('inertia')
var static = inertia.createHandler()
 
   static.encoding       = 'iso-8859-1'                     // set character encoding 
   static.useCache       = false                       // turn off/ on in-memory caching 
   static.useCompression = false                       // turn off/ on compression 
 
   // static.addFileHandler( /^static\..*\.(gif|jpe?g|png)$/i ) // regexp file handler 
         // .addFileHandler( 'html' )                         // add a standard file type, common mime types are handled internally 
         // .addFileHandler( 'm4a' )                         // add a standard file type, common mime types are handled internally 
         // .addFileHandler( 'foo', 'application/foo' )        // add a custom file type with a custom mime type 
 
   // static.addDirHandler( './public' )                          // serve all files from a specific directory 
   static.addDirHandler('./build')
 
   // static.compress( 'css', 'html', 'js', 'json', 'txt' )    // compress (using deflate) files with specific extensions 
 
   // static.maxAge( 'css', 'js'  60 * 60 * 24 )                // add max-age Cache-Control headers for specific extensions 
   //       .maxAge( 'html',      60 * 60 )
 
   http.createServer( function( req, res ) {
      if ( static.serve( req, res ) ) return
 
      // otherwise, do something else... 
   } ).listen( '1337' )