/*
 * @author ohmed
 * DatTank environment manager
*/

import { LocalEnvironment } from "./Local.Environment";
import { StagingEnvironment } from "./Staging.Environment";
import { ProductionEnvironment } from "./Production.Environment";

//

let env;

if ( __dirname.indexOf('/dattank-prod/') !== -1 ) {

    env = ProductionEnvironment;

} else if ( __dirname.indexOf('/dattank-stage/') !== -1 ) {

    env = StagingEnvironment;

} else {

    env = LocalEnvironment;

}

//

export let Environment = env;
