/* eslint-disable no-bitwise */
/* eslint-disable no-useless-escape */
export function getFileName(fullPath: string, notIncludedSuffix?: boolean) {
  let name = fullPath.replace(/^.*[\\\/]/, '');

  return notIncludedSuffix ? name.split('.')[0] : name;
}

export function getFileExtensions(fullPath: string) {
  const ext = fullPath.slice(((fullPath.lastIndexOf('.') - 1) >>> 0) + 2);

  if (ext?.startsWith(' ')) {
    return '';
  }
  return ext;
}

export function getFileSize(bytes: number) {
  let pos = 0;
  let val = bytes;

  while (val >= 1024 && pos < MemoryUnits.length) {
    val = val / 1024;
    pos++;
  }

  return val.toFixed(val < 10 && pos > 0 ? 1 : 0) + ' ' + MemoryUnits[pos];
}

const MemoryUnits = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
