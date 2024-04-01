import * as LAZY from '../lib/lazy-dom'
import bgimage from '@asset/bg/inn.webp'
import hhtitleimage from '@asset/hh-logo.webp'

export const VCOMP = () => {
  LAZY.log("Hack & Hack - XR Tabletop Role-Playing Game (XRTRPG) - Copyright (c) 2024 Timo Saarinen");

  const onEnter = () => {
    console.log("Enter the dungeon!");
  };

  return LAZY.divcover(bgimage, [
    //LAZY.text("Hack & Hack"),
    LAZY.divimage(hhtitleimage),
    LAZY.textinput("Your character name.."),
    LAZY.button("Enter", onEnter)
  ])
};
