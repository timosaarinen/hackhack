import * as LAZY from '../lib/lazy-dom'
import bgimage      from '@asset/bg/inn.webp'
import hhtitleimage from '@asset/hh-logo.webp'

export const VCOMP = () => {
  LAZY.log("Hack & Hack - XR Tabletop Role-Playing Game (XRTRPG) - Copyright (c) 2024 Timo Saarinen");

  // TODO: when character name given, move to next screen in character creation, state

  return LAZY.divcover(bgimage, [
    LAZY.divimage(hhtitleimage),
    LAZY.textinput("Enter your character name.."),
  ])
};
