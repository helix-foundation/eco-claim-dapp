import { useEffect, useState } from "react";

import productionMerkleTree from "../assets/production/tree.json";
import stagingMerkleTree from "../assets/staging/tree.json";
import developmentMerkleTree from "../assets/development/tree.json";

export type MerkleTree = {
  root: string | null;
  leaves: string[] | null;
};

let merkleTree;
switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case 'production':
        merkleTree = productionMerkleTree;
        break;
    case 'staging':
        merkleTree = stagingMerkleTree;
        break;
    case 'development':
    default:
        merkleTree = developmentMerkleTree;
}

const useMerkleTree = () => {
  const [tree, setTree] = useState<MerkleTree>({ root: null, leaves: null });

  const getMerkleTree = async () => {
    try {
      setTree(merkleTree);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMerkleTree();
  }, []);

  return tree;
};

export default useMerkleTree;
