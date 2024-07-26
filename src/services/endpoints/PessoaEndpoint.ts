import { axios } from "../api"
import { AxiosResponse } from "./_axios"

export class Pessoa {
    id: number
    nome: string
    dataNascimento: Date
    cpf: string
    email: string

    constructor(nome?: string, dataNascimento?: Date, cpf?: string, email?: string) {
        this.nome = nome
        this.dataNascimento = dataNascimento
        this.cpf = cpf
        this.email = email
    }
}

export type CreatePessoa = {
    nome: string
    dataNascimento: Date
    cpf: string
    email: string
}

export type EditPessoa = Partial<CreatePessoa>

const PREFIX = '/pessoa'

export class PessoaEndpoint {
    async getAll(): Promise<AxiosResponse<Array<Pessoa>>> {
        return await axios.get(`${PREFIX}/all`)
    }

    async getByNome(nome: string): Promise<AxiosResponse<Array<Pessoa>>> {
        return await axios.get(`${PREFIX}?nome=${nome}`)
    }

    async getById(id: number): Promise<AxiosResponse<Pessoa>> {
        return await axios.get(`${PREFIX}/${id}`)
    }

    async create(pessoa: CreatePessoa): Promise<AxiosResponse<Pessoa>> {
        return await axios.post(`${PREFIX}`, pessoa)
    }

    async update(id: number, pessoa: EditPessoa): Promise<AxiosResponse<Pessoa>> {
        return await axios.patch(`${PREFIX}/${id}`, pessoa)
    }

    async delete(id:number):Promise<void> {
        return await axios.delete(`${PREFIX}/${id}`)
    }
}