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
function root(): HTMLDivElement           { return document.getElementById('root') as HTMLDivElement; }
function newdiv(): HTMLDivElement         { return document.createElement('div'); }
function newinput(): HTMLInputElement     { return document.createElement('input'); }
function newbutton(): HTMLButtonElement   { return document.createElement('button'); }

//************************************************************************
//  TODO: clean
//************************************************************************
//function select(selector, parent = document) { return parent.querySelector(selector); }
//function selectall(selector, parent = document) { return Array.from(parent.querySelectorAll(selector)); }

//function newelement(tag, options = {}) {
//   const el = document.createElement(tag);
//   Object.entries(options).forEach(([key, value]) => {
//     if (key === 'class') {
//       el.className = value;
//     } else {
//       el.setAttribute(key, value);
//     }
//   });
//   return el;
// }

//************************************************************************
//  Events
//************************************************************************
export function on(e: Elem, event: any, handler: any) {
  e.div.addEventListener(event, handler);
}
export function off(e: Elem, event: any, handler: any) {
  e.div.removeEventListener(event, handler);
}
export function log(msg: string): void {
  console.log(msg);
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
  // TODO: use CSS classes or straight up inline styles? CSS classes are more compact/optimal...
  //inputElement.classList.add('input', 'input-bordered', 'input-primary', 'w-full', 'mb-4');
  return {div: div}
}
export function button(txt: string, onclick: any): Elem {
  const div = newbutton();
  div.textContent = txt;
  div.addEventListener('click', onclick);
  return {div: div}
}

//************************************************************************
//  Execute
//************************************************************************
export function run(e: Elem): void {
  root().appendChild(e.div);
}
