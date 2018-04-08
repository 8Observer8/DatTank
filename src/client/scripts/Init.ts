/*
 * @author ohmed
 * Game app init
*/

import * as $ from 'jquery';
import { GameCore } from "./core/Game.Core";

//

var game = new GameCore();
window['game'] = game;

$( document ).ready( game.init.bind( game ) );
