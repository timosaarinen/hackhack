import * as LAZY from '../lib/lazy-dom'

export const VCOMP = () => {
  LAZY.log("Hack & Hack - XR Tabletop Role-Playing Game (XRTRPG) - Copyright (c) 2024 Timo Saarinen");

  const onEnter = () => {
    console.log("Enter the dungeon!");
  };

  return LAZY.div([
    LAZY.text("Hack & Hack"),
    LAZY.textinput("Your character name.."),
    LAZY.button("Enter", onEnter)
  ])
};
