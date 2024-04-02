import * as LAZY from '../lib/lazy-dom'
import hhtitleimage from '@asset/hh-logo.webp'

export const VCOMP = () => {
  return LAZY.div([
    LAZY.divimage(hhtitleimage),
    LAZY.textinput("Enter your character name.."),
  ])
};
