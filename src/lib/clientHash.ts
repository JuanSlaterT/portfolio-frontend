import { getVisitorIpHash } from '@/lib/visitor';

export async function getClientHash() {
  return getVisitorIpHash();
}
