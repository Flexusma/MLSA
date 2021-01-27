const fs = require( 'fs' );
const path = require( 'path' );

const loadFrom = "./data/afinn";

exports.loadLangs= async function () {

    return await load()

}

async function load(){
    let langs=[]
    try {
        const files = await fs.promises.readdir( loadFrom );

        for( const file of files ) {
            let rawdata = await fs.readFileSync(loadFrom+"/"+file);
            let data = JSON.parse(rawdata);



            let name = file+"";
            name = name.replace("AFINN-","");
            name = name.replace(".json","");

            langs.push({
                short:name,
                data:{labels:data}
            });
            console.log( "Reading lang: ",file, "With short: ",name);
        }
    }
    catch( e ) {
        console.error( "We've thrown! Whoops!", e );
    }
    return langs;

}