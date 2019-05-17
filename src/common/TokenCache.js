const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

class TokenCache{

    static TOKEN_PREFIX = 'token_'
    static setKey(key, value){
        myCache.set( key, value, 10*60 );
    }

    static getKey(key){
        return  myCache.get( key );
    }
}

module.exports = {
    TokenCache
}