import { MindExpressionApi } from '../src';
import { LoggerNotExistError } from '../src/utils/errors';
import { initUUID } from '../src/utils/helpers/UuidHelper';

/**
 * Check MindExpressionApi flow of @getLogs
 */
describe('Check API color Logs', () => {
  it('Logs working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
      undefined,
      { useLogger: true }
    );

    await mindaiExpressionApi?.greeting();

    const logs = mindaiExpressionApi?.getLogs();
    expect(logs?.length).not.toEqual(undefined);
    expect(logs?.length).not.toEqual(0);
  });
});

describe('Check API color Logs error', () => {
  it('Logs not working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA'
    );

    await mindaiExpressionApi?.greeting();

    try {
      mindaiExpressionApi?.getLogs();
    } catch (e) {
      expect(e).toMatchObject(new LoggerNotExistError());
    }
  });
});

/**
 * Check MindExpressionApi flow of @resetSession
 */
describe('Check API color resetSession', () => {
  it('resetSession working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
      undefined,
      { useLogger: true }
    );

    await mindaiExpressionApi?.greeting();

    mindaiExpressionApi?.resetSession();
    expect(mindaiExpressionApi?.getSession()).toBe(null);
    const hiRes = await mindaiExpressionApi?.converse('Hi');
    expect(hiRes.code).toBe(1000);
    expect(hiRes.description).toBe('Conversation not started');
  });
});

/**
 * Check MindExpressionApi flow of @setSession
 */
describe('Check API color setSession', () => {
  it('setSession working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
      undefined,
      { useLogger: true }
    );

    const conversationId = initUUID();
    mindaiExpressionApi?.setSession(conversationId);

    expect(mindaiExpressionApi?.getSession()).toBe(conversationId);
  });
});

/**
 * Check MindExpressionApi flow of @getQueryId
 */
describe('Check API color getQueryId', () => {
  it('getQueryId working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
      undefined,
      { useLogger: true }
    );

    expect(mindaiExpressionApi?.getQueryId()).toBe(undefined);
    await mindaiExpressionApi?.greeting();
    expect(mindaiExpressionApi?.getQueryId()).not.toBe(undefined);
    expect(mindaiExpressionApi?.getQueryId()?.length).toBeGreaterThan(0);
  });
});

/**
 * Check MindExpressionApi flow of @getTimestamp
 */
describe('Check API color getTimestamp', () => {
  it('getTimestamp working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
      undefined,
      { useLogger: true }
    );

    expect(mindaiExpressionApi?.getTimestamp()).toBe(undefined);
    await mindaiExpressionApi?.greeting();
    expect(mindaiExpressionApi?.getTimestamp()).not.toBe(undefined);
    expect(mindaiExpressionApi?.getTimestamp()).toBeGreaterThan(0);
  });
});
