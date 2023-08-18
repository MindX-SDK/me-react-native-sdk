import * as uuid from 'uuid';

const UUID_NAMESPACE = '36c3c4a9-811d-50ef-9605-894619b2081d';

export const initUUID = (...strs: string[]) => {
  if (!strs?.filter((it) => !!it)?.length) {
    return uuid.v4();
  }

  let inpStr: string = Array.from(strs, (str: string) => str)?.join('');
  return uuid.v5(inpStr, UUID_NAMESPACE);
};
