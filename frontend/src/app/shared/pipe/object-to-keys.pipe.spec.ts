import { ObjectToKeysPipe } from './object-to-keys.pipe';

describe('ObjectToKeysPipe', () => {
  it('create an instance', () => {
    const pipe = new ObjectToKeysPipe();
    expect(pipe).toBeTruthy();
  });
});
