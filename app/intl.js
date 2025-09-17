// intl.js – micro motore i18n
let _locale = localStorage.getItem('acm_locale') || (navigator.language || 'it').slice(0,2);
const _dict = {};
const _listeners = new Set();

export function addLocale(code, dict){ _dict[code] = dict; }
export function t(key){
  return (_dict[_locale] && _dict[_locale][key]) ||
         (_dict.it && _dict.it[key]) ||
         key;
}
export function setLocale(code){
  _locale = code;
  localStorage.setItem('acm_locale', code);
  _listeners.forEach(fn => { try{ fn(); }catch{} });
}
export function getLocale(){ return _locale; }
export function onChange(fn){ _listeners.add(fn); }

export default { addLocale, t, setLocale, getLocale, onChange };
