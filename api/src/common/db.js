import { MongooseConnection } from '@acidleaf/sprout'

export default new MongooseConnection(process.env.MONGODB_CONN);