//************************************************************************
//
//  Lazy DOM interface
//
//  Copyright (c) 2024 Timo Saarinen. All rights reserved.
//
//************************************************************************

// DOM element description with a link to the actual DOM element
interface Elem {
  div: HTMLDivElement | HTMLButtonElement | HTMLInputElement;
  //text: string,
  children?: Elem[],
}

//************************************************************************
//  Utility functions
//************************************************************************
function root(): HTMLDivElement           { return document.getElementById('layer1') as HTMLDivElement; }
function newdiv(): HTMLDivElement         { return document.createElement('div'); }
function newinput(): HTMLInputElement     { return document.createElement('input'); }
function newbutton(): HTMLButtonElement   { return document.createElement('button'); }
function newimage(): HTMLImageElement     { return document.createElement('img'); }

//************************************************************************
//  Logging and Misc
//************************************************************************
export function log(msg: string): void {
  console.log(msg);
}

//************************************************************************
//  Events
//************************************************************************
export function on(e: Elem, event: any, handler: any) {
  e.div.addEventListener(event, handler);
}
export function off(e: Elem, event: any, handler: any) {
  e.div.removeEventListener(event, handler);
}

//************************************************************************
//  DOM element creation
//************************************************************************
export function text(text: string): Elem {
  const div = newdiv();
  div.textContent = text;
  div.style.color = 'white';
  div.style.fontSize = '42px';
  div.style.padding = '4px'; 
  return {div: div}
}
export function div(es: Elem[]): Elem {
  const div = newdiv();
  es.forEach(e => { div.appendChild(e.div) });
  return {div: div};
}
export function textinput(placeholder: string): Elem {
  const div = newinput();
  div.type = 'text';
  div.placeholder = placeholder;
  return {div: div}
}
export function button(txt: string, onclick: any): Elem {
  const div = newbutton();
  div.textContent = txt;
  div.addEventListener('click', onclick);
  return {div: div}
}
export function divimage(imageurl: string): Elem {
  const div = newimage();
  div.src = imageurl;
  div.style.height = '100%';
  div.style.objectFit = 'contain';
  div.className = 'logo-container'; // TODO: temp
  return {div: div}
}
export function divcover(imageurl: string, es: Elem[]): Elem {
  const div = newdiv();
  es.forEach(e => { div.appendChild(e.div) });

  div.style.backgroundImage = `url('${imageurl}')`;
  // Additional style options to make the background cover the div nicely
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundSize = 'cover';
  div.style.backgroundPosition = 'center';
  div.className = 'divcover'; // TODO: temp
  return {div: div}
}

//************************************************************************
//  Execute
//************************************************************************
export function run(e: Elem): void {
  root().appendChild(e.div);
}
