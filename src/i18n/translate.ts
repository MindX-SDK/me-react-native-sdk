import i18n from 'i18n-js';
import {TxKeyPath} from './i18n';

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: TxKeyPath, options?: i18n.TranslateOptions, locale?: string) {
  //Temp change the locale
  if (locale) {
    i18n.locale = locale;
  }
  const result = i18n.t(key, options);
  return result?.startsWith?.('[missing') ? key : i18n.t(key, options);
}

