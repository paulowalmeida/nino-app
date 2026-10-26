import { useMutation } from '@tanstack/react-query'

import { lookupZipCode } from '@nino/lib/services/zip-code.service'

export const useAddressLookup = () => useMutation({ mutationFn: lookupZipCode })
