// Token address
export const ERC20s = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  CRV: "0xd533a949740bb3306d119cc777fa900ba034cd52",
  LUSD: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
  SETH2: "0xfe2e637202056d30016725477c5da089ab0a043a",
};

// ERC20 token chainlink aggregators
export const USD_ADAPTERs = [
  {
    name: "DAI USD Adapter",
    symbol: "DAI",
    token: "0x6b175474e89094c44da98b954eedeac495271d0f",
    aggregator: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9", // DAI / USD
  },
  {
    name: "USDC USD Adapter",
    symbol: "USDC",
    token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    aggregator: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6", // USDC / USD
  },
  {
    name: "USDT USD Adapter",
    symbol: "USDT",
    token: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    aggregator: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D", // USDT / USD
  },
  {
    name: "WETH USD Adapter",
    symbol: "WETH",
    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    aggregator: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH / USD
  },
  {
    name: "WBTC USD Adapter",
    symbol: "WBTC",
    token: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    aggregator: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c", // BTC / USD
  },
];

// Uniswap V3 Pools
export const Uniswap_V3_Pools = {
  WBTC_USDC: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
  WETH_CRV: "0x919fa96e88d67499339577fa202345436bcdaf79",
  USDC_WETH: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8",
  BUSD_USDC: "0x00cef0386ed94d738c8f8a74e8bfd0376926d24c",
  LUSD_USDC: "0x4e0924d3a751be199c426d52fb1f2337fa96f736",
  LUSD_WETH: "0x9663f2ca0454accad3e094448ea6f77443880454",
  WBTC_WETH: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
  WETH_FREEBRIT: "0x005843e075e77ba46a26d24914db10a4d9ca0122", // FREEBRITNEY has 0 liquidity...
  SETH2_WETH: "0x7379e81228514a1D2a6Cf7559203998E20598346",
};

// Uniswap V2 Pools
export const Uniswap_V2_Pairs = [
  {
    name: "DAI/WETH",
    factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
    tokenA: "0x6b175474e89094c44da98b954eedeac495271d0f",
    tokenB: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  {
    name: "LUSD/WETH",
    factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
    tokenA: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    tokenB: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
];

// Balancer V2 Pools
export const Balancer_V2_Pools = [
  {
    name: "50WBTC/50WETH",
    vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    pool: "0xA6F548DF93de924d73be7D25dC02554c6bD66dB5",
    poolId: "0xa6f548df93de924d73be7d25dc02554c6bd66db500020000000000000000000e",
    tokens: [ERC20s.WBTC, ERC20s.WETH],
    weights: [0.5, 0.5],
    decimals: [8, 18],
  },
  {
    name: "60WETH/40DAI",
    vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    pool: "0x0b09deA16768f0799065C475bE02919503cB2a35",
    poolId: "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
    tokens: [ERC20s.DAI, ERC20s.WETH],
    weights: [0.6, 0.4],
    decimals: [18, 18],
  },
  {
    name: "50USDC/50WETH",
    vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    pool: "0x96646936b91d6B9D7D0c47C496AfBF3D6ec7B6f8",
    poolId: "0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019",
    tokens: [ERC20s.USDC, ERC20s.WETH],
    weights: [0.5, 0.5],
    decimals: [6, 18],
  },
  {
    name: "50WETH/50USDT",
    vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    pool: "0x3e5FA9518eA95c3E533EB377C001702A9AaCAA32",
    poolId: "0x3e5fa9518ea95c3e533eb377c001702a9aacaa32000200000000000000000052",
    tokens: [ERC20s.WETH, ERC20s.USDT],
    weights: [0.5, 0.5],
    decimals: [18, 6],
  },
];

// Curve Meta Pools
export const Curve_Meta_Pools = [
  {
    name: "3pools: DAI/USDC/USDC (3Crv)",
    registry: "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5",
    lp: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    pool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
    tokensLength: 3,
    tokens: [
      "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    ],
  },
  {
    name: "LUSD3CRV-f",
    registry: "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5",
    lp: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    pool: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    tokensLength: 2,
    tokens: [
      "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0", // LUSD
      "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490", // 3Crv
    ],
  },
];

// Curve Non Stable Pools
export const Curve_NonStable_Pools = [
  {
    name: "tricrypto (USDT+WBTC+ETH)",
    registry: "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5",
    lp: "0xca3d75ac011bf5ad07a98d02f18225f9bd9a6bdf",
    pool: "0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5",
    tokens: [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    ],
    weights: [0.33, 0.33, 0.33],
    decimals: [6, 8, 18],
  },
];

// Curve TriCrypto
export const Curve_Tricrypto = {
  name: "tricrypto2 USDT+WBTC+WETH",
  registry: "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5",
  lp: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
  pool: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
  lpPrice: "0xE8b2989276E2Ca8FDEA2268E3551b2b4B2418950",
};

// Element Finance Pools
export const ElementFi_Pools = [
  {
    name: "Element PT(yvCurveLUSD-28SEP21)",
    BALANCE_V2_VAULT: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    ELEMENT_PRINCIPAL_TOKEN_POOL: "0xA8D4433BAdAa1A35506804B43657B0694deA928d", // BALANCE_POOL
    BALANCE_POOL_ID: "0xa8d4433badaa1a35506804b43657b0694dea928d00020000000000000000005e",
    BALANCE_POOL_TOKENS: [
      "0x9b44Ed798a10Df31dee52C5256Dcb4754BCf097E",
      "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    ],
    BALANCE_POOL_TOKENS_DECIMALS: [18, 18],
    ELEMENT_BASET_TOKENT: "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
    ptIndex: 0, // BALANCE_POOL_TOKENS[0] == ELEMENT_BASET_TOKENT ? 1 : 0
    baseIndex: 1, // BALANCE_POOL_TOKENS[0] == ELEMENT_BASET_TOKENT ? 0 : 1;
    convergentExpiration: 1632834462,
    convergentUintSecond: 504911232,
  },
  {
    name: "Element PT(yvCurveLUSD-27DEC21)",
    BALANCE_V2_VAULT: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    ELEMENT_PRINCIPAL_TOKEN_POOL: "0x893B30574BF183d69413717f30b17062eC9DFD8b", // BALANCE_POOL
    BALANCE_POOL_ID: "0x893b30574bf183d69413717f30b17062ec9dfd8b000200000000000000000061",
    BALANCE_POOL_TOKENS: [
      "0xa2b3d083AA1eaa8453BfB477f062A208Ed85cBBF",
      "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    ],
    BALANCE_POOL_TOKENS_DECIMALS: [18, 18],
    ELEMENT_BASET_TOKENT: "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
    ptIndex: 0,
    baseIndex: 1,
    convergentExpiration: 1640620258,
    convergentUintSecond: 757366848,
  },

  {
    name: "Element PT(yvCrvTriCrypto-15AUG21)",
    BALANCE_V2_VAULT: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    ELEMENT_PRINCIPAL_TOKEN_POOL: "0x3A693EB97b500008d4Bb6258906f7Bbca1D09Cc5", // BALANCE_POOL

    BALANCE_POOL_ID: "0x3a693eb97b500008d4bb6258906f7bbca1d09cc5000200000000000000000065",
    BALANCE_POOL_TOKENS: [
      "0x237535Da7e2f0aBa1b68262ABCf7C4e60B42600C",
      "0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF",
    ],
    BALANCE_POOL_TOKENS_DECIMALS: [18, 18],
    ELEMENT_BASET_TOKENT: "0xca3d75ac011bf5ad07a98d02f18225f9bd9a6bdf",
    ptIndex: 0,
    baseIndex: 1,
    convergentExpiration: 1628997564,
    convergentUintSecond: 194390824,
  },
  {
    name: "Element PT(yvCurve-alUSD-28JAN22)",
    BALANCE_V2_VAULT: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    ELEMENT_PRINCIPAL_TOKEN_POOL: "0xC9AD279994980F8DF348b526901006972509677F", // BALANCE_POOL

    BALANCE_POOL_ID: "0xc9ad279994980f8df348b526901006972509677f00020000000000000000009e",
    BALANCE_POOL_TOKENS: [
      "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8cc",
      "0x55096A35Bf827919B3Bb0A5e6b5E2af8095F3D4d",
    ],
    BALANCE_POOL_TOKENS_DECIMALS: [18, 18],
    ELEMENT_BASET_TOKENT: "0xca3d75ac011bf5ad07a98d02f18225f9bd9a6bdf",
    ptIndex: 0,
    baseIndex: 1,
    convergentExpiration: 1643382460,
    convergentUintSecond: 1,
  },
];

// stETH
export const stETH = {
  priceFeed: "0xab55bf4dfbf469ebfe082b7872557d1f87692fe6",
  decimals: 18,
  WETH: ERC20s.WETH,
};
