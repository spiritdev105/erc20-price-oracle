export interface DeploymentAddresses {
  tokens: Tokens;
  wrappedPositions: WrappedPositions;
  vaults: WrappedPositions;
  trancheFactory: string;
  userProxy: string;
  balancerVault: string;
  weightedPoolFactory: string;
  convergentCurvePoolFactory: string;
  tranches: Tranches;
  wrappedCoveredPrincipalTokenFactory: string;
  wrappedCoveredPrincipalToken: WrappedCoveredPrincipalToken;
}
export interface WrappedCoveredPrincipalToken {
  dai: string;
}
export interface Tranches {
  usdc: Usdc[];
  weth: Usdc[];
  dai: Usdc[];
}
export interface Usdc {
  expiration: number;
  address: string;
  ptPool: PtPool;
  ytPool: YtPool;
  trancheFactory: string;
  weightedPoolFactory: string;
  convergentCurvePoolFactory: string;
}
export interface YtPool {
  address: string;
  poolId: string;
  fee: string;
}
export interface PtPool {
  address: string;
  poolId: string;
  fee: string;
  timeStretch: number;
}
export interface WrappedPositions {
  yearn: Tokens;
}
export interface Tokens {
  usdc: string;
  weth: string;
  dai: string;
}
