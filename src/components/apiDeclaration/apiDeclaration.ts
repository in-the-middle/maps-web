import { DefaultApi as AuthServiceApi } from '../../authServiceApi/api'

const authService = new AuthServiceApi(
  'https://auth-service-be-v1-45iud4jnfq-uc.a.run.app/api/v1',
)

export default authService
