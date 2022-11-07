
const etherscanURL = (
  addr: string,
  type: "address" | "tx" | "token"
): string => {
  const explorer =
    process.env.NEXT_PUBLIC_CHAIN !== "mainnet"
      ? `${process.env.NEXT_PUBLIC_CHAIN}.etherscan.io`
      : "etherscan.io";

  return `https://${explorer}/${type}/${addr}`;
};

export default etherscanURL;