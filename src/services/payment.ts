export async function authorizeDemo(outcome: 'success' | 'failure') { await new Promise(resolve=>setTimeout(resolve,1500)); return outcome === 'success'; }
