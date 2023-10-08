import dayjs from 'dayjs'
import useSWR from 'swr'
import { fetchPurchaseInfo } from '~services/server-api'

export function usePurchaseInfo() {
  return useSWR('premium-info', fetchPurchaseInfo)
}

export function useDiscountCode() {
  const { data } = usePurchaseInfo()
  if (!data) {
    return undefined
  }
  const { discount } = data
  if (discount && dayjs(discount.startTime).add(1, 'day').isAfter()) {
    return discount.code
  }
}
