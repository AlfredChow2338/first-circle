export async function mockSettleTransaction(delayMs = 2000): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
