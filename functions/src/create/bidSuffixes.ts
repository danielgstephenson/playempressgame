import { Suffixes } from '../types'

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
    return {
      private: 'the highest untied bid',
      public: 'the highest untied bid'
    }
  }
  if (tying) {
    return {
      private: 'tying the highest untied bid',
      public: 'tying the highest untied bid'
    }
  }
  return {
    private: "which isn't pivotal",
    public: "which isn't pivotal"
  }
}
