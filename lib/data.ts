import { ERC725 } from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

export const fetchUPMetadata = async (address: string) => {
  const erc725js = new ERC725(
    profileSchema,
    address,
    "https://rpc.mainnet.lukso.network",
    {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
    }
  );
  const decodedProfileMetadata = await erc725js.fetchData("LSP3Profile");
  return decodedProfileMetadata.value as {
    LSP3Profile: Record<string, any>;
  };
};
