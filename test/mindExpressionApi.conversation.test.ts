import { MindExpressionApi } from '../src';

/**
 * Check MindExpressionApi flow with @constructor, @greeting and @converse
 */
describe('Check API inital', () => {
  it('init API success', () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    expect(mindaiExpressionApi.DEVELOPER_ID).toBe('Zyv6zF5sS_Gl9XE4-PX3Tg');
    expect(mindaiExpressionApi.SCOPE_ID).toBe('V9xW5DtdQay5cIaCZ6sxKw');
  });
});

describe('Check API color conversation', () => {
  it('Conversation flow working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(201);

    const hiRes = await mindaiExpressionApi?.converse('Hi');
    expect(hiRes.code).toBe(200);

    const redRes = await mindaiExpressionApi?.converse('Red');
    expect(redRes.code).toBe(200);

    const yesRes = await mindaiExpressionApi?.converse('Yes');
    expect(yesRes.code).toBe(200);

    const byeRes = await mindaiExpressionApi?.converse('Bye');
    expect(byeRes.code).toBe(200);
  });
});

describe('Check API color Greeting multiple time', () => {
  it('Conversation flow working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(201);

    const hiRes = await mindaiExpressionApi?.converse('Hi');
    expect(hiRes.code).toBe(200);

    const redRes = await mindaiExpressionApi?.converse('Red');
    expect(redRes.code).toBe(200);

    const greeting2 = await mindaiExpressionApi?.greeting();
    expect(greeting2.code).toBe(201);

    const greeting3 = await mindaiExpressionApi?.greeting();
    expect(greeting3.code).toBe(201);

    const hiRes2 = await mindaiExpressionApi?.converse('Hi');
    expect(hiRes2.code).toBe(200);

    const greeting4 = await mindaiExpressionApi?.greeting();
    expect(greeting4.code).toBe(201);
  }, 60000);
});

describe('Check API motor start', () => {
  it('Greeting OK', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(201);
  });
});

describe('Check API start Authentication error', () => {
  it('Return error 401', async () => {

    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw', 
      '2J2bTvbBRku_VUEiKT3Kga', //Wrong Authentication
    );
    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(401);
    expect(greeting.description).toBe('Unauthorized');
  });
});

describe('Check API start wrong developer_id', () => {
  it('Return error 500', async () => {

    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Ta/V9xW5DtdQay5cIaCZ6sxKw', //Wrong developer_id
      '2J2bTvbBRku_VUEiKT3Kga',
    );
    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(500);
    expect(greeting.description).toBe('Internal server error.');
  });
});

describe('Check API start wrong scope_id', () => {
  it('Return error 400', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxaa', //Wrong scope_id
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    const greeting = await mindaiExpressionApi?.greeting();
    expect(greeting.code).toBe(400);
    expect(greeting.description).toBe('Invalid Scope');
  });
});

/**
 * Check MindExpressionApi flow of @restart
 */
describe('Check API color Restart', () => {
  it('Restart flow working', async () => {
    const mindaiExpressionApi: MindExpressionApi = new MindExpressionApi(
      'https://me-dev.mind.ai/api/v1/gateway/default/Zyv6zF5sS_Gl9XE4-PX3Tg/V9xW5DtdQay5cIaCZ6sxKw',
      '2J2bTvbBRku_VUEiKT3KgA',
    );

    const greeting = await mindaiExpressionApi?.greeting();
    const hiRes = await mindaiExpressionApi?.converse('Hi');

    const restartRes = await mindaiExpressionApi?.restart();
    expect(restartRes.code).toBe(201);
  });
});
