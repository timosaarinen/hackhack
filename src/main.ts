import './main.css'
import {VCOMP as characterCreationScreen} from './screen/charactercreation'
import * as LAZY from './lib/lazy-dom'

LAZY.run( characterCreationScreen() );
