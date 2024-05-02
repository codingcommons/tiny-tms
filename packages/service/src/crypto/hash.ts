import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export function hash(predigest: string) {
	return bcrypt.hashSync(predigest, SALT_ROUNDS)
}

export function compare(predigest: string, digest: string) {
	return bcrypt.compareSync(predigest, digest)
}
