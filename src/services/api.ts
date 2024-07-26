import axios from './endpoints/_axios'
import { PessoaEndpoint } from './endpoints/PessoaEndpoint'

const api = {
  pessoa: new PessoaEndpoint(),
}

export type Api = typeof api

export default api
export {axios}
