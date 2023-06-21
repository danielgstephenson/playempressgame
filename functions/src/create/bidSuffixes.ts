import { Suffixes } from "../types"

export default function createBidSuffixes ({
  name,
  tying,
  winning
}: {
  name: string
  tying: boolean
  winning: boolean
}): Suffixes {
  if (winning) {
    const prefix = ', making'
    const suffix = 'the highest untied bidder'
    return {
      private: `${prefix} you ${suffix}`,
      public: `${prefix} ${name} ${suffix}`
    }
  }
  if (tying) {
    return {
      private: ', tying the highest untied bid',
      public: ', tying the highest untied bid'
    }
  }
  return {
    private: "which isn't pivotal",
    public: "which isn't pivotal"
  }
}