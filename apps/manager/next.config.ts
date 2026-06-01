import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@nino/ds', '@nino/forms', '@nino/lib'],
}

export default config
